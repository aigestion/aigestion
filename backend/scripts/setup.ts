import chalk from 'chalk';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';

// Tipos de variables de entorno
type EnvType = 'string' | 'number' | 'boolean' | 'url' | 'email' | 'jwt' | 'api-key' | 'password';

// Interfaz para la configuración de variables de entorno
interface EnvVarConfig {
  description: string;
  type: EnvType;
  required: boolean;
  default?: string | ((answers: Record<string, any>) => string);
  sensitive?: boolean;
  validate?: (value: string, answers?: Record<string, any>) => boolean | string;
  choices?: string[];
  when?: boolean | ((answers: Record<string, any>) => boolean);
  autoGenerate?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternDescription?: string;
}

// Generar una cadena aleatoria segura
const generateSecureString = (length = 64): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Obtener la IP local
const getLocalIp = (): string => {
  try {
    return execSync('hostname -I').toString().trim().split(' ')[0];
  } catch {
    return '127.0.0.1';
  }
};

// Configuración de las variables de entorno
const envConfig: Record<string, EnvVarConfig> = {
  // Configuración básica
  NODE_ENV: {
    description: 'Entorno de ejecución',
    type: 'string',
    required: true,
    default: 'development',
    choices: ['development', 'production', 'test'],
  },

  // Servidor
  PORT: {
    description: 'Puerto del servidor HTTP',
    type: 'number',
    required: false,
    default: '5000',
    validate: (value: string) => {
      const port = parseInt(value, 10);
      if (isNaN(port)) {
        return 'Debe ser un número';
      }
      if (port < 1 || port > 65535) {
        return 'El puerto debe estar entre 1 y 65535';
      }
      return true;
    },
  },

  HOST: {
    description: 'Dirección IP del servidor',
    type: 'string',
    required: false,
    default: getLocalIp,
    validate: (value: string) => {
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
        return 'Dirección IP inválida';
      }
      return true;
    },
  },

  // Base de datos
  MONGODB_URI: {
    description: 'URL de conexión a MongoDB',
    type: 'url',
    required: true,
    default: 'mongodb://user:password@localhost:27017/NEXUS-V1-dashboard?authSource=admin',
    validate: (value: string) => {
      if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
        return 'La URL debe comenzar con mongodb:// o mongodb+srv://';
      }
      return true;
    },
  },

  // Autenticación JWT
  JWT_SECRET: {
    description: 'Clave secreta para firmar tokens JWT',
    type: 'jwt',
    required: true,
    sensitive: true,
    autoGenerate: true,
    minLength: 32,
    default: () => generateSecureString(64),
  },

  JWT_EXPIRES_IN: {
    description: 'Tiempo de expiración del token JWT',
    type: 'string',
    required: false,
    default: '7d',
    validate: (value: string) => {
      if (!/^\d+[smhd]$/.test(value)) {
        return 'Formato inválido. Usa números seguidos de s (segundos), m (minutos), h (horas) o d (días)';
      }
      return true;
    },
  },

  // API de Gemini
  GEMINI_API_KEY: {
    description: 'Clave de API para Google Gemini',
    type: 'api-key',
    required: true,
    sensitive: true,
    pattern: /^AIza[\w-]{35,}$/,
    patternDescription:
      'Debe ser una clave de API de Google Gemini válida (comienza con AIza y tiene al menos 39 caracteres)',
  },

  // CORS
  CORS_ORIGIN: {
    description: 'Orígenes permitidos para CORS (separados por comas)',
    type: 'string',
    required: false,
    default: 'http://localhost:3000,http://localhost:5000',
  },

  // Límites de tasa
  RATE_LIMIT_WINDOW_MS: {
    description: 'Ventana de tiempo para el límite de tasa (en milisegundos)',
    type: 'number',
    required: false,
    default: '900000', // 15 minutos
  },

  RATE_LIMIT_MAX: {
    description: 'Número máximo de solicitudes por ventana de tiempo',
    type: 'number',
    required: false,
    default: '100',
  },

  // Configuración de correo (opcional)
  EMAIL_ENABLED: {
    description: '¿Habilitar el envío de correos electrónicos?',
    type: 'boolean',
    required: false,
    default: 'false',
  },

  SMTP_HOST: {
    description: 'Servidor SMTP para envío de correos',
    type: 'string',
    required: false,
    default: 'smtp.gmail.com',
  },

  SMTP_PORT: {
    description: 'Puerto del servidor SMTP',
    type: 'number',
    required: false,
    default: '587',
  },

  SMTP_USER: {
    description: 'Usuario SMTP',
    type: 'email',
    required: false,
  },

  SMTP_PASSWORD: {
    description: 'Contraseña SMTP',
    type: 'password',
    required: false,
    sensitive: true,
  },
};

// Validadores por tipo
const validators: Record<string, (value: string, config?: EnvVarConfig) => boolean | string> = {
  string: (value: string, _config?: EnvVarConfig) =>
    (typeof value === 'string' && value.length > 0) || 'Valor requerido',
  number: (value: string, _config?: EnvVarConfig) => !isNaN(Number(value)) || 'Debe ser un número válido',
  boolean: (value: string, _config?: EnvVarConfig) =>
    ['true', 'false', '0', '1'].includes(value.toLowerCase()) || 'Debe ser verdadero o falso',
  url: (value: string, _config?: EnvVarConfig) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'URL inválida';
    }
  },
  email: (value: string, _config?: EnvVarConfig) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Correo electrónico inválido',
  'api-key': (value: string, config?: EnvVarConfig) => {
    if (config?.pattern && !config.pattern.test(value)) {
      return config.patternDescription || 'Formato de clave API inválido';
    }
    return true;
  },
  jwt: (value: string, config?: EnvVarConfig) => {
    if (config?.minLength && value.length < config.minLength) {
      return `La longitud mínima es ${config.minLength} caracteres`;
    }
    return true;
  },
  password: (value: string, config?: EnvVarConfig) => {
    if (config?.minLength && value.length < config.minLength) {
      return `La contraseña debe tener al menos ${config.minLength} caracteres`;
    }
    return true;
  },
};

// Función principal
async function setupEnvironment() {
  console.clear();
  console.log(chalk.blue.bold('🚀 Asistente de Configuración - NEXUS V1 Dashboard\n'));
  console.log(
    chalk.gray(
      'Este asistente te guiará en la configuración de las variables de entorno necesarias.\n',
    ),
  );

  // Cargar variables existentes
  const envPath = path.join(process.cwd(), '.env');
  const existingEnv: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = /^([^=#][^=]*?)\s*=\s*(.*?)\s*$/.exec(line);
      if (match) {
        const [, key, value] = match;
        existingEnv[key] = value.replace(/(^['"]|['"]$)/g, '');
      }
    });

    console.log(
      chalk.yellow(
        '🔍 Se detectó un archivo .env existente. Se preservarán los valores actuales.\n',
      ),
    );
  }

  // Preparar preguntas
  const questions = Object.entries(envConfig)
    .filter(([key, config]) => {
      // Omitir si ya existe y no se fuerza la actualización
      if (existingEnv[key] !== undefined && !process.argv.includes('--force')) {
        return false;
      }
      // Ejecutar condición when si existe
      if (typeof config.when === 'function') {
        return config.when({ ...existingEnv });
      }

      if (typeof config.when === 'boolean') {
        return config.when;
      }

      return true;
    })
    .map(([key, config]) => {
      const defaultValue =
        typeof config.default === 'function' ? config.default({ ...existingEnv }) : config.default;

      return {
        type: config.sensitive ? 'password' : 'input',
        name: key,
        message: `${chalk.cyan(key)}: ${config.description}${
          config.required ? chalk.red('*') : ''
        }`,
        default: existingEnv[key] ?? defaultValue,
        validate: (value: string) => {
          if (config.required && !value) {
            return 'Este campo es obligatorio';
          }

          const validator = validators[config.type] || validators.string;
          const result = validator(value, config);

          if (typeof result === 'string') {
            return result;
          }

          if (config.pattern && !config.pattern.test(value)) {
            return config.patternDescription || 'Formato inválido';
          }

          if (config.minLength && value.length < config.minLength) {
            return `Mínimo ${config.minLength} caracteres`;
          }

          if (config.maxLength && value.length > config.maxLength) {
            return `Máximo ${config.maxLength} caracteres`;
          }

          return true;
        },
        when: !process.argv.includes('--skip-optional') || config.required,
      };
    });

  // Si no hay preguntas, mostrar mensaje y salir
  if (questions.length === 0) {
    console.log(
      chalk.green('✅ Todas las variables de entorno ya están configuradas correctamente.\n'),
    );
    console.log(chalk.blue('📄 Archivo .env encontrado en:'), envPath);
    process.exit(0);
  }

  // Mostrar resumen de lo que se configurará
  console.log(chalk.blue('📋 Se configurarán las siguientes variables de entorno:'));
  questions.forEach(q => {
    const isNew = !existingEnv[q.name];
    console.log(
      `  ${isNew ? chalk.green('+') : chalk.yellow('~')} ${chalk.cyan(q.name)}: ${chalk.gray(
        q.message.split(': ')[1],
      )}`,
    );
  });
  console.log('');

  // Confirmar antes de continuar
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '¿Deseas continuar con la configuración?',
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Configuración cancelada por el usuario.\n'));
    process.exit(0);
  }

  // Obtener respuestas
  const answers = await inquirer.prompt(questions);

  // Combinar con valores existentes
  const updatedEnv = { ...existingEnv, ...answers };

  // Generar claves automáticamente si es necesario
  for (const [key, config] of Object.entries(envConfig)) {
    if (config.autoGenerate && !updatedEnv[key]) {
      updatedEnv[key] =
        typeof config.default === 'function'
          ? config.default(updatedEnv)
          : generateSecureString(32);
    }
  }

  // Generar contenido del archivo .env
  const envContent =
    Object.entries(updatedEnv)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        // Escapar caracteres especiales
        const escapedValue = String(value)
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n');

        // Usar comillas si contiene espacios o caracteres especiales
        const formattedValue = /[\s#"']/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;

        return `${key}=${formattedValue}`;
      })
      .join('\n') + '\n'; // Asegurar salto de línea final

  // Crear directorio .env si no existe
  const envDir = path.dirname(envPath);
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // Escribir archivo .env
  fs.writeFileSync(envPath, envContent);

  // Mostrar resumen
  console.log(chalk.green('\n✅ Configuración completada con éxito!\n'));
  console.log(chalk.blue('📄 Archivo .env actualizado en:'), envPath);

  // Mostrar resumen de valores sensibles
  console.log('\n🔐 Valores configurados:');
  Object.entries(envConfig).forEach(([key, config]) => {
    if (key in updatedEnv) {
      const value = updatedEnv[key];
      const displayValue = config.sensitive
        ? chalk.gray('*'.repeat(8) + (value.length > 8 ? '...' : ''))
        : chalk.yellow(`"${value}"`);

      console.log(`  ${chalk.cyan(key)}: ${displayValue}`);
    }
  });

  // Mostrar próximos pasos
  console.log(
    '\n🚀 ' + chalk.green.bold('¡Listo para comenzar!') + ' Ejecuta los siguientes comandos:',
  );
  console.log(chalk.blue('   npm install') + '         - Instalar dependencias');
  console.log(chalk.blue('   npm run dev') + '           - Iniciar servidor en modo desarrollo');
  console.log(chalk.blue('   npm run build') + '         - Compilar para producción');
  console.log(chalk.blue('   npm start') + '             - Iniciar servidor en producción\n');
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
  console.error('\n❌ ' + chalk.red('Error inesperado:'));
  console.error(error);
  process.exit(1);
});

// Ejecutar el asistente
if (require.main === module) {
  setupEnvironment().catch(error => {
    console.error('\n❌ ' + chalk.red('Error durante la configuración:'));
    console.error(error);
    process.exit(1);
  });
}

export { setupEnvironment };
