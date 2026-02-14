#!/usr/bin/env node

/**
 * Docker MCP Server - Divine Level
 * Container management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class DockerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'docker',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'docker_list_containers',
          description: 'List all Docker containers',
          inputSchema: {
            type: 'object',
            properties: {
              all: { type: 'boolean', description: 'Include stopped containers' },
              filters: { type: 'object', description: 'Container filters' },
            },
          },
        },
        {
          name: 'docker_run_container',
          description: 'Run a Docker container',
          inputSchema: {
            type: 'object',
            properties: {
              image: { type: 'string', description: 'Docker image name' },
              name: { type: 'string', description: 'Container name' },
              ports: { type: 'array', items: { type: 'string' }, description: 'Port mappings' },
              environment: { type: 'object', description: 'Environment variables' },
              volumes: { type: 'array', items: { type: 'string' }, description: 'Volume mappings' },
              detach: { type: 'boolean', description: 'Run in detached mode' },
            },
            required: ['image'],
          },
        },
        {
          name: 'docker_stop_container',
          description: 'Stop a Docker container',
          inputSchema: {
            type: 'object',
            properties: {
              container_id: { type: 'string', description: 'Container ID or name' },
            },
            required: ['container_id'],
          },
        },
        {
          name: 'docker_start_container',
          description: 'Start a Docker container',
          inputSchema: {
            type: 'object',
            properties: {
              container_id: { type: 'string', description: 'Container ID or name' },
            },
            required: ['container_id'],
          },
        },
        {
          name: 'docker_remove_container',
          description: 'Remove a Docker container',
          inputSchema: {
            type: 'object',
            properties: {
              container_id: { type: 'string', description: 'Container ID or name' },
              force: { type: 'boolean', description: 'Force removal' },
            },
            required: ['container_id'],
          },
        },
        {
          name: 'docker_container_logs',
          description: 'Get container logs',
          inputSchema: {
            type: 'object',
            properties: {
              container_id: { type: 'string', description: 'Container ID or name' },
              follow: { type: 'boolean', description: 'Follow log output' },
              tail: { type: 'number', description: 'Number of lines to show from end' },
            },
            required: ['container_id'],
          },
        },
        {
          name: 'docker_build_image',
          description: 'Build Docker image from Dockerfile',
          inputSchema: {
            type: 'object',
            properties: {
              context_path: { type: 'string', description: 'Build context path' },
              dockerfile: { type: 'string', description: 'Dockerfile path' },
              tag: { type: 'string', description: 'Image tag' },
              build_args: { type: 'object', description: 'Build arguments' },
            },
            required: ['context_path', 'tag'],
          },
        },
        {
          name: 'docker_list_images',
          description: 'List Docker images',
          inputSchema: {
            type: 'object',
            properties: {
              all: { type: 'boolean', description: 'Include intermediate images' },
              filters: { type: 'object', description: 'Image filters' },
            },
          },
        },
        {
          name: 'docker_prune',
          description: 'Prune unused Docker resources',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['containers', 'images', 'volumes', 'networks', 'all'],
                description: 'Resource type to prune',
              },
              force: { type: 'boolean', description: 'Force pruning' },
            },
          },
        },
        {
          name: 'docker_compose_up',
          description: 'Start services with Docker Compose',
          inputSchema: {
            type: 'object',
            properties: {
              compose_file: { type: 'string', description: 'Docker Compose file path' },
              services: {
                type: 'array',
                items: { type: 'string' },
                description: 'Specific services to start',
              },
              detach: { type: 'boolean', description: 'Run in detached mode' },
            },
            required: ['compose_file'],
          },
        },
        {
          name: 'docker_compose_down',
          description: 'Stop services with Docker Compose',
          inputSchema: {
            type: 'object',
            properties: {
              compose_file: { type: 'string', description: 'Docker Compose file path' },
              remove_volumes: { type: 'boolean', description: 'Remove volumes' },
            },
            required: ['compose_file'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'docker_list_containers':
            return await this.listContainers(args);
          case 'docker_run_container':
            return await this.runContainer(args);
          case 'docker_stop_container':
            return await this.stopContainer(args);
          case 'docker_start_container':
            return await this.startContainer(args);
          case 'docker_remove_container':
            return await this.removeContainer(args);
          case 'docker_container_logs':
            return await this.getContainerLogs(args);
          case 'docker_build_image':
            return await this.buildImage(args);
          case 'docker_list_images':
            return await this.listImages(args);
          case 'docker_prune':
            return await this.pruneResources(args);
          case 'docker_compose_up':
            return await this.composeUp(args);
          case 'docker_compose_down':
            return await this.composeDown(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async listContainers(args) {
    const { all, filters } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Container List:\n\nAll containers: ${all ? 'Yes' : 'No'}\nFilters: ${JSON.stringify(filters || {}, null, 2)}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares container listing.`,
        },
      ],
    };
  }

  async runContainer(args) {
    const { image, name, ports, environment, volumes, detach } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Run Container:\n\nImage: ${image}\nName: ${name || 'Auto-generated'}\nPorts: ${ports ? ports.join(', ') : 'None'}\nEnvironment: ${JSON.stringify(environment || {}, null, 2)}\nVolumes: ${volumes ? volumes.join(', ') : 'None'}\nDetached: ${detach || false}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares container execution.`,
        },
      ],
    };
  }

  async stopContainer(args) {
    const { container_id } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Stop Container:\n\nContainer: ${container_id}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares container stop operation.`,
        },
      ],
    };
  }

  async startContainer(args) {
    const { container_id } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Start Container:\n\nContainer: ${container_id}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares container start operation.`,
        },
      ],
    };
  }

  async removeContainer(args) {
    const { container_id, force } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Remove Container:\n\nContainer: ${container_id}\nForce: ${force || false}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares container removal.`,
        },
      ],
    };
  }

  async getContainerLogs(args) {
    const { container_id, follow, tail } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Container Logs:\n\nContainer: ${container_id}\nFollow: ${follow || false}\nTail: ${tail || 'All'}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares log retrieval.`,
        },
      ],
    };
  }

  async buildImage(args) {
    const { context_path, dockerfile, tag, build_args } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Build Image:\n\nContext: ${context_path}\nDockerfile: ${dockerfile || 'Dockerfile'}\nTag: ${tag}\nBuild Args: ${JSON.stringify(build_args || {}, null, 2)}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares image building.`,
        },
      ],
    };
  }

  async listImages(args) {
    const { all, filters } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Image List:\n\nAll images: ${all ? 'Yes' : 'No'}\nFilters: ${JSON.stringify(filters || {}, null, 2)}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares image listing.`,
        },
      ],
    };
  }

  async pruneResources(args) {
    const { type, force } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Prune Resources:\n\nType: ${type || 'all'}\nForce: ${force || false}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares resource pruning.`,
        },
      ],
    };
  }

  async composeUp(args) {
    const { compose_file, services, detach } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Compose Up:\n\nCompose File: ${compose_file}\nServices: ${services ? services.join(', ') : 'All'}\nDetached: ${detach || false}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares compose up.`,
        },
      ],
    };
  }

  async composeDown(args) {
    const { compose_file, remove_volumes } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Docker Compose Down:\n\nCompose File: ${compose_file}\nRemove Volumes: ${remove_volumes || false}\n\nNote: Actual Docker operations require Docker client library.\n\nThis prepares compose down.`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = error => console.error('[Docker MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Docker MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new DockerMCPServer();
  server.run().catch(console.error);
}

module.exports = DockerMCPServer;
