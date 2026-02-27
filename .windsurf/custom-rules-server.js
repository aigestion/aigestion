#!/usr/bin/env node

/**
 * AIGestion Custom Rules Engine — Sovereign Edition
 * Version: 1.1.0-sovereign
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const { printBanner, logTelemetry } = require('./Sovereign-Banner.js');

class CustomRulesEngine {
  constructor() {
    this.rules = new Map();
    this.loadSovereignRules();
  }

  loadSovereignRules() {
    // ───────────── SOVEREIGN AESTHETIC RULES ─────────────
    this.rules.set('sovereign-color-vars', {
      name: 'Sovereign Aesthetic Adherence',
      description: 'Verifica que no se usen colores hardcodeados (plain red, blue, etc.)',
      pattern: /color:\s*(red|blue|green|yellow|black|white|purple);/i,
      action: 'reject',
      severity: 'high',
      hint: 'Usa variables HSL o el sistema de tokens de Sovereign.',
    });

    this.rules.set('sovereign-gradient-check', {
      name: 'Smooth Experience Validation',
      description: 'Recomienda el uso de gradientes para un look Premium',
      pattern: /background-color:\s*#[0-9a-f]{3,6}/i,
      action: 'suggest',
      severity: 'medium',
      hint: 'Considera usar un gradiente lineal suave para mayor profundidad visual.',
    });

    // ───────────── SECURITY & ARCHITECTURE ─────────────
    this.rules.set('security-secrets', {
      name: 'Sovereign Security Scan',
      description: 'Detección de secretos en código',
      pattern: /(?:\b)(?:password|secret|token|api_key|private_key)(?:\b)/i,
      action: 'block',
      severity: 'critical',
    });

    this.rules.set('inversify-pattern', {
      name: 'Architecture Alignment',
      description: 'Verifica el uso de InversifyJS para DI',
      pattern: /new\s+[A-Z][a-zA-Z0-9]+Service\(\)/,
      action: 'review',
      severity: 'medium',
      hint: 'Usa la inyección de dependencias (Container.get) en lugar de instanciación manual.',
    });
  }

  evaluateRules(content) {
    const results = [];
    for (const [ruleName, rule] of this.rules) {
      if (rule.pattern.test(content)) {
        results.push({
          rule: ruleName,
          severity: rule.severity,
          action: rule.action,
          hint: rule.hint,
        });
      }
    }
    return results;
  }
}

const server = new Server(
  { name: 'custom-rules-sovereign', version: '1.1.0-sovereign' },
  { capabilities: { tools: {} } }
);

const engine = new CustomRulesEngine();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      { name: 'evaluate_rules', description: 'Evalúa contenido contra reglas Soberanas', inputSchema: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] } },
      { name: 'list_rules', description: 'Lista reglas de estética y arquitectura activas', inputSchema: { type: 'object', properties: {} } },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();
  try {
    let result;
    if (name === 'evaluate_rules') result = engine.evaluateRules(args.content);
    else if (name === 'list_rules') result = Array.from(engine.rules.values());
    else throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);

    logTelemetry(name, Date.now() - startTime);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Rules Error: ${error.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  printBanner('custom-rules-sovereign', '1.1.0-sovereign');
}

if (require.main === module) main().catch(e => process.exit(1));
