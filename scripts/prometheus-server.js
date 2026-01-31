#!/usr/bin/env node

/**
 * Prometheus MCP Server - Divine Level
 * Metrics collection and monitoring for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class PrometheusMCPServer {
  constructor() {
    this.server = new Server({
      name: 'prometheus',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'prometheus_query',
          description: 'Execute PromQL query',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'PromQL query string' },
              time: { type: 'string', description: 'Query timestamp (optional)' },
              timeout: { type: 'number', description: 'Query timeout in seconds' }
            },
            required: ['query']
          }
        },
        {
          name: 'prometheus_metrics_list',
          description: 'List available metrics',
          inputSchema: {
            type: 'object',
            properties: {
              pattern: { type: 'string', description: 'Metric name pattern' }
            }
          }
        },
        {
          name: 'prometheus_series_info',
          description: 'Get series information',
          inputSchema: {
            type: 'object',
            properties: {
              match: { type: 'string', description: 'Series selector' },
              start: { type: 'string', description: 'Start time' },
              end: { type: 'string', description: 'End time' }
            },
            required: ['match']
          }
        },
        {
          name: 'prometheus_targets',
          description: 'Get Prometheus targets',
          inputSchema: {
            type: 'object',
            properties: {
              state: { type: 'string', enum: ['active', 'down', 'any'], description: 'Target state filter' }
            }
          }
        },
        {
          name: 'prometheus_alerts',
          description: 'Get active alerts',
          inputSchema: {
            type: 'object',
            properties: {
              silenced: { type: 'boolean', description: 'Include silenced alerts' },
              inhibited: { type: 'boolean', description: 'Include inhibited alerts' }
            }
          }
        },
        {
          name: 'prometheus_rules',
          description: 'Get recording and alerting rules',
          inputSchema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['recording', 'alerting', 'all'], description: 'Rule type filter' }
            }
          }
        },
        {
          name: 'prometheus_config',
          description: 'Get Prometheus configuration',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'prometheus_status',
          description: 'Get Prometheus status information',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'prometheus_query':
            return await this.executeQuery(args);
          case 'prometheus_metrics_list':
            return await this.listMetrics(args);
          case 'prometheus_series_info':
            return await this.getSeriesInfo(args);
          case 'prometheus_targets':
            return await this.getTargets(args);
          case 'prometheus_alerts':
            return await this.getAlerts(args);
          case 'prometheus_rules':
            return await this.getRules(args);
          case 'prometheus_config':
            return await this.getConfig(args);
          case 'prometheus_status':
            return await this.getStatus(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.message}`
          }]
        };
      }
    });
  }

  async executeQuery(args) {
    const { query, time, timeout } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Query:\n\nQuery: ${query}\nTime: ${time || 'Current time'}\nTimeout: ${timeout || 30}s\n\nNote: Actual Prometheus queries require Prometheus client library.\n\nThis prepares the PromQL query for execution.`
      }]
    };
  }

  async listMetrics(args) {
    const { pattern } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Metrics List:\n\nPattern: ${pattern || 'All metrics'}\n\nCommon metrics:\n- up\n- http_requests_total\n- cpu_usage_percent\n- memory_usage_bytes\n- disk_usage_percent\n- network_bytes_sent\n- network_bytes_received\n\nNote: Actual metrics listing requires Prometheus client library.\n\nThis prepares metrics listing.`
      }]
    };
  }

  async getSeriesInfo(args) {
    const { match, start, end } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Series Info:\n\nMatch: ${match}\nStart: ${start || '1 hour ago'}\nEnd: ${end || 'Now'}\n\nNote: Actual series information requires Prometheus client library.\n\nThis prepares series information retrieval.`
      }]
    };
  }

  async getTargets(args) {
    const { state } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Targets:\n\nState: ${state || 'All'}\n\nTarget categories:\n- Active targets\n- Down targets\n- Discovered targets\n\nNote: Actual target information requires Prometheus client library.\n\nThis prepares target listing.`
      }]
    };
  }

  async getAlerts(args) {
    const { silenced, inhibited } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Alerts:\n\nSilenced: ${silenced || false}\nInhibited: ${inhibited || false}\n\nAlert types:\n- Firing alerts\n- Pending alerts\n- Resolved alerts\n\nNote: Actual alert information requires Prometheus client library.\n\nThis prepares alert listing.`
      }]
    };
  }

  async getRules(args) {
    const { type } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Prometheus Rules:\n\nType: ${type || 'All'}\n\nRule categories:\n- Recording rules\n- Alerting rules\n- Rule groups\n\nNote: Actual rule information requires Prometheus client library.\n\nThis prepares rule listing.`
      }]
    };
  }

  async getConfig(args) {
    return {
      content: [{
        type: 'text',
        text: `Prometheus Configuration:\n\nConfiguration sections:\n- Global settings\n- Scrape configs\n- Alerting rules\n- Remote write\n- Storage\n\nNote: Actual configuration requires Prometheus client library.\n\nThis prepares configuration retrieval.`
      }]
    };
  }

  async getStatus(args) {
    return {
      content: [{
        type: 'text',
        text: `Prometheus Status:\n\nStatus information:\n- Build information\n- Runtime information\n- Flags\n- Configuration\n- TSDB status\n\nNote: Actual status requires Prometheus client library.\n\nThis prepares status retrieval.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[Prometheus MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Prometheus MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new PrometheusMCPServer();
  server.run().catch(console.error);
}

module.exports = PrometheusMCPServer;
