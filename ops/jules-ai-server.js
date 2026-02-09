#!/usr/bin/env node

/**
 * Jules AI Assistant MCP Server - Divine Level
 * Integración con Google Jules AI para desarrollo avanzado
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class JulesAIServer {
  constructor() {
    this.server = new Server({
      name: 'jules-ai-assistant',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'jules_code_generation',
          description: 'Generate code using Google Jules AI assistant',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: { type: 'string', description: 'Code generation prompt' },
              language: { type: 'string', enum: ['python', 'javascript', 'typescript', 'java', 'go', 'rust'], description: 'Programming language' },
              context: { type: 'string', description: 'Additional context for code generation' }
            },
            required: ['prompt', 'language']
          }
        },
        {
          name: 'jules_code_review',
          description: 'Review and improve code using Jules AI',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code to review' },
              focus: { type: 'string', enum: ['performance', 'security', 'readability', 'best-practices'], description: 'Review focus area' }
            },
            required: ['code']
          }
        },
        {
          name: 'jules_debug_assistance',
          description: 'Debug code issues with Jules AI help',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code with issues' },
              error_message: { type: 'string', description: 'Error message' },
              stack_trace: { type: 'string', description: 'Stack trace' }
            },
            required: ['code']
          }
        },
        {
          name: 'jules_optimization',
          description: 'Optimize code performance with Jules AI',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code to optimize' },
              optimization_type: { type: 'string', enum: ['speed', 'memory', 'algorithm', 'parallel'], description: 'Type of optimization' }
            },
            required: ['code']
          }
        },
        {
          name: 'jules_architecture_review',
          description: 'Review software architecture with Jules AI',
          inputSchema: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Architecture description' },
              code_snippets: { type: 'array', items: { type: 'string' }, description: 'Relevant code snippets' }
            },
            required: ['description']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'jules_code_generation':
            return await this.generateCode(args);
          case 'jules_code_review':
            return await this.reviewCode(args);
          case 'jules_debug_assistance':
            return await this.debugCode(args);
          case 'jules_optimization':
            return await this.optimizeCode(args);
          case 'jules_architecture_review':
            return await this.reviewArchitecture(args);
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

  async generateCode(args) {
    const { prompt, language, context } = args;
    
    const julesPrompt = `As Google Jules AI assistant, generate ${language} code for: ${prompt}

${context ? `Context: ${context}` : ''}

Requirements:
- Write clean, efficient, and well-documented code
- Follow ${language} best practices
- Include error handling where appropriate
- Add comments explaining complex logic
- Use modern ${language} features

Code:`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(julesPrompt);
    
    return {
      content: [{
        type: 'text',
        text: result.response.text()
      }]
    };
  }

  async reviewCode(args) {
    const { code, focus } = args;
    
    const reviewPrompt = `As Google Jules AI assistant, review this code focusing on ${focus}:

Code:
\`\`\`
${code}
\`\`\

Provide:
- Detailed analysis
- Specific issues found
- Improvement suggestions
- Best practices recommendations
- Refactored code examples if needed`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(reviewPrompt);
    
    return {
      content: [{
        type: 'text',
        text: result.response.text()
      }]
    };
  }

  async debugCode(args) {
    const { code, error_message, stack_trace } = args;
    
    const debugPrompt = `As Google Jules AI assistant, help debug this code:

Code:
\`\`\`
${code}
\`\`\`

Error: ${error_message || 'No error message provided'}
${stack_trace ? `\nStack Trace:\n${stack_trace}` : ''}

Provide:
- Root cause analysis
- Step-by-step debugging approach
- Fixed code solution
- Prevention recommendations`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(debugPrompt);
    
    return {
      content: [{
        type: 'text',
        text: result.response.text()
      }]
    };
  }

  async optimizeCode(args) {
    const { code, optimization_type } = args;
    
    const optimizePrompt = `As Google Jules AI assistant, optimize this code for ${optimization_type}:

Code:
\`\`\`
${code}
\`\`\`

Provide:
- Optimized version of the code
- Explanation of optimizations made
- Performance improvements achieved
- Before/after comparison
- Additional optimization suggestions`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(optimizePrompt);
    
    return {
      content: [{
        type: 'text',
        text: result.response.text()
      }]
    };
  }

  async reviewArchitecture(args) {
    const { description, code_snippets } = args;
    
    const archPrompt = `As Google Jules AI assistant, review this software architecture:

Description:
${description}

${code_snippets.length > 0 ? `\nCode Snippets:\n${code_snippets.join('\n\n')}` : ''}

Provide:
- Architecture assessment
- Design pattern recommendations
- Scalability considerations
- Security analysis
- Improvement suggestions
- Alternative approaches if applicable`;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(archPrompt);
    
    return {
      content: [{
        type: 'text',
        text: result.response.text()
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[Jules AI MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Jules AI Assistant MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new JulesAIServer();
  server.run().catch(console.error);
}

module.exports = JulesAIServer;
