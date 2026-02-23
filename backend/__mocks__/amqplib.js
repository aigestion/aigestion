/**
 * Automatic Jest manual mock for amqplib (node_module).
 * Must live in <rootDir>/__mocks__/amqplib.js for Jest to auto-resolve.
 * Jest docs: "If the module you are mocking is a Node module, the mock
 * should be placed in the __mocks__ directory adjacent to node_modules."
 */

const mockChannel = {
  prefetch: jest.fn().mockResolvedValue(undefined),
  assertQueue: jest.fn().mockResolvedValue({ queue: 'mock-queue', messageCount: 0, consumerCount: 0 }),
  assertExchange: jest.fn().mockResolvedValue({ exchange: 'mock-exchange' }),
  bindQueue: jest.fn().mockResolvedValue(undefined),
  consume: jest.fn().mockResolvedValue({ consumerTag: 'mock-tag' }),
  sendToQueue: jest.fn().mockReturnValue(true),
  publish: jest.fn().mockReturnValue(true),
  ack: jest.fn(),
  nack: jest.fn(),
  close: jest.fn().mockResolvedValue(undefined),
  on: jest.fn().mockReturnThis(),
};

const mockConnection = {
  createChannel: jest.fn().mockResolvedValue(mockChannel),
  close: jest.fn().mockResolvedValue(undefined),
  on: jest.fn().mockReturnThis(),
};

module.exports = {
  connect: jest.fn().mockResolvedValue(mockConnection),
};
