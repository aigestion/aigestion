#!/usr/bin/env node

/**
 * Stripe MCP Server - Divine Level
 * Payment processing for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class StripeMCPServer {
  constructor() {
    this.server = new Server({
      name: 'stripe',
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
          name: 'stripe_create_payment_intent',
          description: 'Create a payment intent',
          inputSchema: {
            type: 'object',
            properties: {
              amount: { type: 'number', description: 'Amount in cents' },
              currency: { type: 'string', description: 'Currency code (USD, EUR, etc.)' },
              payment_method: { type: 'string', description: 'Payment method ID' },
              customer_id: { type: 'string', description: 'Customer ID' },
              description: { type: 'string', description: 'Payment description' },
              metadata: { type: 'object', description: 'Payment metadata' }
            },
            required: ['amount', 'currency']
          }
        },
        {
          name: 'stripe_confirm_payment',
          description: 'Confirm a payment intent',
          inputSchema: {
            type: 'object',
            properties: {
              payment_intent_id: { type: 'string', description: 'Payment intent ID' },
              payment_method: { type: 'string', description: 'Payment method ID' }
            },
            required: ['payment_intent_id']
          }
        },
        {
          name: 'stripe_create_customer',
          description: 'Create a customer',
          inputSchema: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'Customer email' },
              name: { type: 'string', description: 'Customer name' },
              phone: { type: 'string', description: 'Customer phone' },
              metadata: { type: 'object', description: 'Customer metadata' }
            },
            required: ['email']
          }
        },
        {
          name: 'stripe_create_product',
          description: 'Create a product',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Product name' },
              description: { type: 'string', description: 'Product description' },
              price: { type: 'number', description: 'Price in cents' },
              currency: { type: 'string', description: 'Currency code' },
              images: { type: 'array', items: { type: 'string' }, description: 'Product images' }
            },
            required: ['name', 'price', 'currency']
          }
        },
        {
          name: 'stripe_create_subscription',
          description: 'Create a subscription',
          inputSchema: {
            type: 'object',
            properties: {
              customer_id: { type: 'string', description: 'Customer ID' },
              price_id: { type: 'string', description: 'Price ID' },
              trial_period_days: { type: 'number', description: 'Trial period in days' },
              metadata: { type: 'object', description: 'Subscription metadata' }
            },
            required: ['customer_id', 'price_id']
          }
        },
        {
          name: 'stripe_list_customers',
          description: 'List customers',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of customers to return' },
              email: { type: 'string', description: 'Filter by email' },
              created_after: { type: 'string', description: 'Filter by creation date' }
            }
          }
        },
        {
          name: 'stripe_list_products',
          description: 'List products',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of products to return' },
              active: { type: 'boolean', description: 'Filter by active status' }
            }
          }
        },
        {
          name: 'stripe_list_subscriptions',
          description: 'List subscriptions',
          inputSchema: {
            type: 'object',
            properties: {
              customer_id: { type: 'string', description: 'Filter by customer ID' },
              status: { type: 'string', enum: ['active', 'canceled', 'incomplete', 'trialing', 'past_due'], description: 'Subscription status' }
            }
          }
        },
        {
          name: 'stripe_refund_payment',
          description: 'Refund a payment',
          inputSchema: {
            type: 'object',
            properties: {
              payment_intent_id: { type: 'string', description: 'Payment intent ID' },
              amount: { type: 'number', description: 'Refund amount in cents' },
              reason: { type: 'string', description: 'Refund reason' }
            },
            required: ['payment_intent_id']
          }
        },
        {
          name: 'stripe_webhook_handler',
          description: 'Handle Stripe webhooks',
          inputSchema: {
            type: 'object',
            properties: {
              event_type: { type: 'string', description: 'Webhook event type' },
              event_data: { type: 'object', description: 'Webhook event data' },
              signature: { type: 'string', description: 'Stripe signature' },
              secret: { type: 'string', description: 'Webhook secret' }
            },
            required: ['event_type', 'event_data', 'signature', 'secret']
          }
        },
        {
          name: 'stripe_get_balance',
          description: 'Get Stripe account balance',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'stripe_create_invoice',
          description: 'Create an invoice',
          inputSchema: {
            type: 'object',
            properties: {
              customer_id: { type: 'string', description: 'Customer ID' },
              amount: { type: 'number', description: 'Invoice amount in cents' },
              currency: { type: 'string', description: 'Currency code' },
              description: { type: 'string', description: 'Invoice description' },
              due_date: { type: 'string', description: 'Invoice due date' }
            },
            required: ['customer_id', 'amount', 'currency']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'stripe_create_payment_intent':
            return await this.createPaymentIntent(args);
          case 'stripe_confirm_payment':
            return await this.confirmPayment(args);
          case 'stripe_create_customer':
            return await this.createCustomer(args);
          case 'stripe_create_product':
            return await this.createProduct(args);
          case 'stripe_create_subscription':
            return await this.createSubscription(args);
          case 'stripe_list_customers':
            return await this.listCustomers(args);
          case 'stripe_list_products':
            return await this.listProducts(args);
          case 'stripe_list_subscriptions':
            return await this.listSubscriptions(args);
          case 'stripe_refund_payment':
            return await this.refundPayment(args);
          case 'stripe_webhook_handler':
            return await this.handleWebhook(args);
          case 'stripe_get_balance':
            return await this.getBalance(args);
          case 'stripe_create_invoice':
            return await this.createInvoice(args);
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

  async createPaymentIntent(args) {
    const { amount, currency, payment_method, customer_id, description, metadata } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Payment Intent Creation:\n\nAmount: ${amount} cents (${(amount/100).toFixed(2)} ${currency.toUpperCase()})\nPayment Method: ${payment_method || 'Auto-generated'}\nCustomer ID: ${customer_id || 'New customer'}\nDescription: ${description || 'Payment for AIGestion Pro 2026'}\nMetadata: ${JSON.stringify(metadata || {}, null, 2)}\n\nPayment Intent ID: pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual payment intent creation requires Stripe API.\n\nThis prepares payment intent creation.`
      }]
    };
  }

  async confirmPayment(args) {
    const { payment_intent_id, payment_method } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Payment Confirmation:\n\nPayment Intent ID: ${payment_intent_id}\nPayment Method: ${payment_method || 'Auto-selected'}\n\nNote: Actual payment confirmation requires Stripe API.\n\nThis prepares payment confirmation.`
      }]
    };
  }

  async createCustomer(args) {
    const { email, name, phone, metadata } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Customer Creation:\n\nEmail: ${email}\nName: ${name || ''}\nPhone: ${phone || ''}\nMetadata: ${JSON.stringify(metadata || {}, null, 2)}\n\nCustomer ID: cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual customer creation requires Stripe API.\n\nThis prepares customer creation.`
      }]
    };
  }

  async createProduct(args) {
    const { name, description, price, currency, images } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Product Creation:\n\nName: ${name}\nDescription: ${description || ''}\nPrice: ${(price/100).toFixed(2)} ${currency.toUpperCase()}\nImages: ${images ? images.join(', ') : 'None'}\n\nProduct ID: prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual product creation requires Stripe API.\n\nThis prepares product creation.`
      }]
    };
  }

  async createSubscription(args) {
    const { customer_id, price_id, trial_period_days, metadata } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Subscription Creation:\n\nCustomer ID: ${customer_id}\nPrice ID: ${price_id}\nTrial Period: ${trial_period_days || 0} days\nMetadata: ${JSON.stringify(metadata || {}, null, 2)}\n\nSubscription ID: sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual subscription creation requires Stripe API.\n\nThis prepares subscription creation.`
      }]
    };
  }

  async listCustomers(args) {
    const { limit, email, created_after } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Customers List:\n\nLimit: ${limit || 10}\nEmail Filter: ${email || 'None'}\nCreated After: ${created_after || 'None'}\n\nSample customers:\n- Customer ID: cus_1 - Email: user@example.com - Status: Active\n- Customer ID: cus_2 - Email: user2@example.com - Status: Active\n\nNote: Actual customer listing requires Stripe API.\n\nThis prepares customer listing.`
      }]
    };
  }

  async listProducts(args) {
    const { limit, active } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Products List:\n\nLimit: ${limit || 10}\nActive Only: ${active !== false ? 'Yes' : 'No'}\n\nSample products:\n- Product ID: prod_1 - Name: AIGestion Pro Plan - Price: $99.00 - Status: Active\n- Product ID: prod_2 - Name: AIGestion Enterprise - Price: $299.00 - Status: Active\n\nNote: Actual product listing requires Stripe API.\n\nThis prepares product listing.`
      }]
    };
  }

  async listSubscriptions(args) {
    const { customer_id, status } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Subscriptions List:\n\nCustomer ID: ${customer_id || 'All customers'}\nStatus: ${status || 'All statuses'}\n\nSample subscriptions:\n- Subscription ID: sub_1 - Customer: cus_1 - Status: Active\n- Subscription ID: sub_2 - Customer: cus_2 - Status: Active\n\nNote: Actual subscription listing requires Stripe API.\n\nThis prepares subscription listing.`
      }]
    };
  }

  async refundPayment(args) {
    const { payment_intent_id, amount, reason } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Payment Refund:\n\nPayment Intent ID: ${payment_intent_id}\nAmount: ${amount ? (amount/100).toFixed(2) : 'Full amount'}\nReason: ${reason || 'Customer request'}\n\nRefund ID: re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual refund requires Stripe API.\n\nThis prepares payment refund.`
      }]
    };
  }

  async handleWebhook(args) {
    const { event_type, event_data, signature, secret } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Webhook Handler:\n\nEvent Type: ${event_type}\nEvent Data: ${JSON.stringify(event_data, null, 2)}\nSignature: ${signature}\nSecret: ${secret ? 'Provided' : 'Required'}\n\nValidation: HMAC-SHA256 signature verification\n\nNote: Actual webhook handling requires Stripe webhook library.\n\nThis prepares webhook handling.`
      }]
    };
  }

  async getBalance(args) {
    return {
      content: [{
        type: 'text',
        text: `Stripe Account Balance:\n\nBalance Information:\n- Available Balance\n- Pending Balance\n- Currency\n- Last Updated\n\nNote: Actual balance retrieval requires Stripe API.\n\nThis prepares balance retrieval.`
      }]
    };
  }

  async createInvoice(args) {
    const { customer_id, amount, currency, description, due_date } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Stripe Invoice Creation:\n\nCustomer ID: ${customer_id}\nAmount: ${(amount/100).toFixed(2)} ${currency.toUpperCase()}\nDescription: ${description || 'Invoice for AIGestion Pro 2026'}\nDue Date: ${due_date || 'Due in 30 days'}\n\nInvoice ID: in_${Date.now()}_${Math.random().toString(36).substr(2, 9)}\n\nNote: Actual invoice creation requires Stripe API.\n\nThis prepares invoice creation.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[Stripe MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Stripe MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new StripeMCPServer();
  server.run().catch(console.error);
}

module.exports = StripeMCPServer;
