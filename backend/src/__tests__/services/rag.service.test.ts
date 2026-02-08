import { RagService } from '../../services/rag.service';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');
jest.mock('../../utils/logger'); // Mock logger to avoid noise

describe('RagService - Hybrid Search Simulation', () => {
  let ragService: RagService;
  let mockVault: any;
  const mockFiles = [
    {
      name: 'auth.service.ts',
      path: 'auth.service.ts',
      content: 'This service handles authentication logic. Login, register, JWT.',
      isDirectory: () => false,
      isFile: () => true,
    },
    {
      name: 'user.controller.ts',
      path: 'user.controller.ts',
      content: 'Controller for user management. Create, update, delete users.',
      isDirectory: () => false,
      isFile: () => true,
    },
    {
      name: 'unrelated.ts',
      path: 'unrelated.ts',
      content: 'Just some completely random utility functions.',
      isDirectory: () => false,
      isFile: () => true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockVault = {
      query: jest.fn().mockResolvedValue([]),
    };
    ragService = new RagService(mockVault);

    // Mock queryRustCore and other services to avoid side effects
    (ragService as any).queryRustCore = jest.fn().mockResolvedValue([]);
    (ragService as any).queryLocalMemory = jest.fn().mockResolvedValue(null);

    // Mock readdir to return our structure
    (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);

    // Mock readFile to return content based on path
    (fs.readFile as jest.Mock).mockImplementation(async (filePath: string) => {
      const basename = path.basename(filePath);
      const file = mockFiles.find(f => f.name === basename);
      return file ? file.content : '';
    });

    // Mock path.relative to just return the filename for simplicity in tests
    jest.spyOn(path, 'relative').mockImplementation((_from, to) => {
      return path.basename(to);
    });
  });

  it('should prioritize files with matching filename (Structural Score)', async () => {
    const context = await ragService.getProjectContext('auth');
    console.log('DEBUG CONTEXT (Structural):', context); // DEBUG LOG

    expect(context).toContain('[Code Context optimized for query: "auth"]');

    const authPos = context.indexOf('path="auth.service.ts"');
    const userPos = context.indexOf('path="user.controller.ts"');
    const unrelatedPos = context.indexOf('path="unrelated.ts"');

    expect(authPos).not.toBe(-1);
    expect(userPos).not.toBe(-1);

    expect(authPos).toBeLessThan(userPos);
    expect(authPos).toBeLessThan(unrelatedPos);
  });

  it('should prioritize files with matching content (Keyword Score)', async () => {
    const context = await ragService.getProjectContext('JWT');
    console.log('DEBUG CONTEXT (Keyword):', context); // DEBUG LOG

    const authPos = context.indexOf('path="auth.service.ts"');
    const userPos = context.indexOf('path="user.controller.ts"');

    expect(authPos).not.toBe(-1);
    expect(userPos).not.toBe(-1);

    expect(authPos).toBeLessThan(userPos);
  });

  it('should perform RRF blending (Structure + Keyword)', async () => {
    const context = await ragService.getProjectContext('user management');
    console.log('DEBUG CONTEXT (RRF):', context); // DEBUG LOG

    const userPos = context.indexOf('path="user.controller.ts"');
    const authPos = context.indexOf('path="auth.service.ts"');

    expect(userPos).not.toBe(-1);
    expect(authPos).not.toBe(-1);

    expect(userPos).toBeLessThan(authPos);
  });

  it('should fallback to full context if query is empty', async () => {
    const context = await ragService.getProjectContext('');
    expect(context).toContain('[Full Context - No Query Provided]');
  });
});
