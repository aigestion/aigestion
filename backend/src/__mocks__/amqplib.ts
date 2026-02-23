/**
 * Automatic Jest mock for amqplib.
 * Placed in src/__mocks__ so Jest's automatic mock resolution picks it up
 * for all test suites — including those that call jest.resetModules().
 */

const mockChannel = {
  prefetch: jest.fn().mockResolvedValue(undefined),
  assertQueue: jest
    .fn()
    .mockResolvedValue({ queue: 'mock-queue', messageCount: 0, consumerCount: 0 }),
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

const amqplib = {
  connect: jest.fn().mockResolvedValue(mockConnection),
};

module.exports = amqplib;
export default amqplib;
