import * as redis from 'redis';
import { getRedisClient, resetRedisClient } from '../redis';

jest.mock('redis');
jest.mock('../../utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));

describe.skip('Redis Configuration', () => {
    const mockCreateClient = jest.fn();
    const mockCreateCluster = jest.fn();
    const mockConnect = jest.fn();
    const mockOn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        resetRedisClient();

        // Reset env
        delete process.env.REDIS_CLUSTER_NODES;
        delete process.env.REDIS_HOST;
        delete process.env.REDIS_PORT;
        delete process.env.REDIS_PASSWORD;

        // Setup mocks
        (redis.createClient as jest.Mock) = mockCreateClient;
        (redis.createCluster as jest.Mock) = mockCreateCluster;

        const mockClient = {
            connect: mockConnect,
            on: mockOn,
            isOpen: true,
        };

        mockCreateClient.mockReturnValue(mockClient);
        mockCreateCluster.mockReturnValue(mockClient);
    });

    it('should create a standalone client when REDIS_CLUSTER_NODES is missing', () => {
        process.env.REDIS_HOST = 'localhost';
        process.env.REDIS_PORT = '6379';

        getRedisClient();

        expect(mockCreateClient).toHaveBeenCalled();
        expect(mockCreateCluster).not.toHaveBeenCalled();
        expect(mockCreateClient).toHaveBeenCalledWith(expect.objectContaining({
            url: 'redis://localhost:6379'
        }));
    });

    it('should create a cluster client when REDIS_CLUSTER_NODES is present', () => {
        process.env.REDIS_CLUSTER_NODES = 'redis://node1:6379,redis://node2:6379';

        getRedisClient();

        expect(mockCreateCluster).toHaveBeenCalled();
        expect(mockCreateClient).not.toHaveBeenCalled();
        expect(mockCreateCluster).toHaveBeenCalledWith(expect.objectContaining({
            rootNodes: [
                { url: 'redis://node1:6379' },
                { url: 'redis://node2:6379' }
            ]
        }));
    });
});
