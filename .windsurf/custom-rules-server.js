#!/usr/bin/env node

/**
 * AIGestion Custom Rules Engine MCP Server
 * Proporciona capacidades avanzadas de personalización de reglas para Windsurf
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

class CustomRulesEngine {
  constructor() {
    this.rules = new Map();
    this.customPatterns = new Map();
    this.loadDefaultRules();
  }

  loadDefaultRules() {
    // Reglas de seguridad
    this.rules.set('security-scan', {
      name: 'Security Scan',
      description: 'Escaneo de seguridad avanzado',
      pattern: /(?=.*\b(password|secret|token|api_key|private_key)\b)/i,
      action: 'alert',
      severity: 'high'
    });

    // Reglas de código
    this.rules.set('code-quality', {
      name: 'Code Quality',
      description: 'Verificación de calidad de código',
      pattern: /console\.(log|debug|info)/,
      action: 'warning',
      severity: 'medium'
    });

    // Reglas de arquitectura
    this.rules.set('architecture-check', {
      name: 'Architecture Check',
      description: 'Validación de patrones de arquitectura',
      pattern: /class.*extends.*Component/,
      action: 'review',
      severity: 'low'
    });
  }

  addCustomRule(name, rule) {
    this.rules.set(name, rule);
    return { success: true, message: `Rule ${name} added successfully` };
  }

  evaluateRules(content) {
    const results = [];

    for (const [ruleName, rule] of this.rules) {
      if (rule.pattern.test(content)) {
        results.push({
          rule: ruleName,
          severity: rule.severity,
          action: rule.action,
          description: rule.description,
          matches: content.match(rule.pattern)
        });
      }
    }

    return results;
  }

  generateCustomCode(pattern, language, description) {
    const templates = {
      javascript: {
        function: `// Custom generated function: ${description}\nfunction customFunction() {\n  // Pattern: ${pattern}\n  // TODO: Implement custom logic\n}`,
        class: `// Custom generated class: ${description}\nclass CustomClass {\n  constructor() {\n    // Pattern: ${pattern}\n  }\n}`
      },
      python: {
        function: `# Custom generated function: ${description}\ndef custom_function():\n    # Pattern: ${pattern}\n    # TODO: Implement custom logic\n    pass`,
        class: `# Custom generated class: ${description}\nclass CustomClass:\n    def __init__(self):\n        # Pattern: ${pattern}\n        pass`
      }
    };

    const lang = language.toLowerCase();
    if (templates[lang]) {
      return templates[lang];
    }

    return { error: 'Language not supported' };
  }
}

const server = new Server(
  {
    name: 'custom-rules-engine',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const rulesEngine = new CustomRulesEngine();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'evaluate_rules',
        description: 'Evalúa contenido contra reglas personalizadas',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Contenido a evaluar',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'add_custom_rule',
        description: 'Agrega una regla personalizada',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre de la regla' },
            pattern: { type: 'string', description: 'Patrón regex' },
            action: { type: 'string', description: 'Acción a tomar' },
            severity: { type: 'string', description: 'Severidad' },
            description: { type: 'string', description: 'Descripción' },
          },
          required: ['name', 'pattern', 'action', 'severity'],
        },
      },
      {
        name: 'generate_custom_code',
        description: 'Genera código personalizado basado en patrones',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'Patrón detectado' },
            language: { type: 'string', description: 'Lenguaje de programación' },
            description: { type: 'string', description: 'Descripción del código' },
            type: { type: 'string', description: 'Tipo (function/class)' },
          },
          required: ['pattern', 'language', 'type'],
        },
      },
      {
        name: 'list_rules',
        description: 'Lista todas las reglas activas',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'evaluate_rules': {
        const { content } = args;
        const results = rulesEngine.evaluateRules(content);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'add_custom_rule': {
        const { name: ruleName, pattern, action, severity, description } = args;
        const regexPattern = new RegExp(pattern, 'i');
        const result = rulesEngine.addCustomRule(ruleName, {
          name: ruleName,
          pattern: regexPattern,
          action,
          severity,
          description: description || `Custom rule: ${ruleName}`
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_custom_code': {
        const { pattern, language, description, type } = args;
        const code = rulesEngine.generateCustomCode(pattern, language, description);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(code, null, 2),
            },
          ],
        };
      }

      case 'list_rules': {
        const rules = Array.from(rulesEngine.rules.entries()).map(([name, rule]) => ({
          name,
          description: rule.description,
          severity: rule.severity,
          action: rule.action
        }));
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rules, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Custom Rules Engine MCP Server running on stdio');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}
