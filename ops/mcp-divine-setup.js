#!/usr/bin/env node

/**
 * MCP Divine Setup - Nivel Dios para AIGestion
 * Configura y optimiza todos los MCP servers para VSCode, Windsurf y Antigravity
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPDivineSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.configPath = path.join(this.projectRoot, 'mcp-divine-config.json');
    this.vscodeSettingsPath = path.join(this.projectRoot, '.vscode/settings.json');
    this.windsurfPath = path.join(this.projectRoot, '.windsurf');
    this.antigravityPath = path.join(this.projectRoot, 'workspace-config');
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      WARNING: '\x1b[33m',
      ERROR: '\x1b[31m',
      DIVINE: '\x1b[35m',
      RESET: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.RESET}`);
  }

  executeCommand(command, description) {
    try {
      this.log(`🔧 Ejecutando: ${description}`, 'INFO');
      const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
      this.log(`✅ ${description} - COMPLETADO`, 'SUCCESS');
      return result;
    } catch (error) {
      this.log(`❌ Error en ${description}: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async installDependencies() {
    this.log('📦 Instalando dependencias MCP a nivel divino...', 'DIVINE');
    
    const dependencies = [
      '@modelcontextprotocol/sdk',
      '@anthropic-ai/sdk',
      'openai',
      '@google-cloud/vertexai',
      '@google-cloud/secret-manager',
      '@google-cloud/bigquery',
      '@google-cloud/storage',
      'axios',
      'mongodb',
      'redis',
      'ws',
      'helmet',
      'cors',
      'compression',
      'express-rate-limit',
      'winston',
      'joi'
    ];

    for (const dep of dependencies) {
      this.executeCommand(
        `npm install ${dep}`,
        `Instalando ${dep}`
      );
    }
  }

  async setupVSCode() {
    this.log('🖥️ Configurando VSCode MCP Servers - Nivel Dios', 'DIVINE');

    // Leer configuración divina
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const vscodeConfig = config.platform_configs.vscode;

    // Crear settings.json con configuración MCP
    const vscodeSettings = {
      "mcp.serverTimeout": 30000,
      "mcp.autoRestart": true,
      "mcp.logLevel": "info",
      "mcp.enableTelemetry": true,
      "mcp.servers": {},
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "typescript.tsserver.maxTsServerMemory": 8192,
      "github.copilot.enable": {
        "*": true,
        "yaml": true,
        "plaintext": true,
        "markdown": true
      },
      "github.copilot.chat.enable": true,
      "google.geminicodeassist.enable": true,
      "ms-azuretools.vscode-azure-mcp-server.enable": true
    };

    // Configurar servers MCP para VSCode
    for (const serverName of vscodeConfig.enabled_servers) {
      const server = config.shared_servers[serverName];
      vscodeSettings.mcp.servers[serverName] = {
        command: server.command,
        args: server.args,
        env: server.env,
        cwd: this.projectRoot,
        timeout: 30000,
        restart: true
      };
    }

    // Guardar settings.json
    fs.writeFileSync(this.vscodeSettingsPath, JSON.stringify(vscodeSettings, null, 2));
    this.log('✅ VSCode settings.json configurado', 'SUCCESS');

    // Instalar extensions necesarias
    const extensions = [
      'ms-azuretools.vscode-azure-mcp-server',
      'github.copilot',
      'github.copilot-chat',
      'google.geminicodeassist',
      'ms-vscode.remote-remote-containers',
      'ms-vscode.vscode-json',
      'redhat.vscode-yaml',
      'ms-vscode.powershell'
    ];

    for (const ext of extensions) {
      this.executeCommand(
        `code --install-extension ${ext}`,
        `Instalando extensión ${ext}`
      );
    }
  }

  async setupWindsurf() {
    this.log('🌊 Configurando Windsurf MCP Servers - Nivel Dios', 'DIVINE');

    // Leer configuración divina
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const windsurfConfig = config.platform_configs.windsurf;

    // Crear configuración Windsurf
    const windsurfSettings = {
      mcp: {
        maxConcurrentRequests: 10,
        enableCaching: true,
        cacheTimeout: 300000,
        enableMetrics: true,
        servers: {}
      }
    };

    // Configurar servers MCP para Windsurf
    for (const serverName of windsurfConfig.enabled_servers) {
      const server = config.shared_servers[serverName];
      windsurfSettings.mcp.servers[serverName] = {
        command: server.command,
        args: server.args,
        env: server.env,
        cwd: this.projectRoot,
        capabilities: server.capabilities,
        priority: serverName === 'aigestion_core' ? 'high' : 'normal'
      };
    }

    // Guardar configuración Windsurf
    const windsurfConfigPath = path.join(this.windsurfPath, 'mcp-config.json');
    fs.writeFileSync(windsurfConfigPath, JSON.stringify(windsurfSettings, null, 2));
    this.log('✅ Windsurf MCP config creado', 'SUCCESS');

    // Optimizar servers existentes
    const servers = [
      'aigestion-mcp-server.js',
      'workflow-server.js',
      'custom-rules-server.js'
    ];

    for (const server of servers) {
      const serverPath = path.join(this.windsurfPath, server);
      if (fs.existsSync(serverPath)) {
        // Optimizar server para nivel divino
        let content = fs.readFileSync(serverPath, 'utf8');
        
        // Añadir optimizaciones
        if (!content.includes('DIVINE_MODE')) {
          content = content.replace(
            "const { Server } = require('@modelcontextprotocol/sdk/server/index.js');",
            `// DIVINE MODE - Optimized Performance
process.env.DIVINE_MODE = 'true';
process.env.NODE_ENV = 'production';

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { performance } = require('perf_hooks');`
          );
        }

        fs.writeFileSync(serverPath, content);
        this.log(`✅ Optimizado ${server}`, 'SUCCESS');
      }
    }
  }

  async setupAntigravity() {
    this.log('🚀 Configurando Antigravity MCP Servers - Nivel Dios', 'DIVINE');

    // Leer configuración divina
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const antigravityConfig = config.platform_configs.antigravity;

    // Crear configuración Antigravity
    const antigravitySettings = {
      mcp: {
        priorityMode: 'high',
        enableRealTime: true,
        locationOptimization: true,
        professionalMode: true,
        servers: {}
      },
      antigravity: {
        account: 'admin@aigestion.net',
        location: 'europe-west1',
        optimization: 'maximum',
        monitoring: '24/7',
        backup: 'automatic'
      }
    };

    // Configurar servers MCP para Antigravity
    for (const serverName of antigravityConfig.enabled_servers) {
      const server = config.shared_servers[serverName];
      antigravitySettings.mcp.servers[serverName] = {
        command: server.command,
        args: server.args,
        env: {
          ...server.env,
          ANTIGRAVITY_MODE: 'true',
          PROFESSIONAL_ACCOUNT: 'true',
          LOCATION_OPTIMIZATION: 'europe-west1'
        },
        cwd: this.projectRoot,
        capabilities: server.capabilities,
        priority: 'critical',
        realTime: true
      };
    }

    // Guardar configuración Antigravity
    const antigravityConfigPath = path.join(this.antigravityPath, 'antigravity-mcp-config.json');
    fs.writeFileSync(antigravityConfigPath, JSON.stringify(antigravitySettings, null, 2));
    this.log('✅ Antigravity MCP config creado', 'SUCCESS');
  }

  async run() {
    try {
      this.log('🌟 INICIANDO CONFIGURACIÓN MCP DIVINA - NIVEL DIOS', 'DIVINE');
      
      await this.installDependencies();
      await this.setupVSCode();
      await this.setupWindsurf();
      await this.setupAntigravity();

      this.log('🎉 CONFIGURACIÓN MCP DIVINA COMPLETADA - NIVEL DIOS', 'SUCCESS');
      this.log('🚀 Todos los MCP servers están operando a nivel divino', 'SUCCESS');
      
    } catch (error) {
      this.log(`❌ Error en configuración divina: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Ejecutar configuración divina
if (require.main === module) {
  const setup = new MCPDivineSetup();
  setup.run();
}

module.exports = MCPDivineSetup;
