export const google = {
  auth: {
    GoogleAuth: jest.fn().mockImplementation(() => ({
      getClient: jest.fn().mockResolvedValue({}),
    })),
  },
  drive: jest.fn().mockReturnValue({
    files: {
      list: jest.fn().mockResolvedValue({ data: { files: [] } }),
      create: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
      update: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
      get: jest.fn().mockResolvedValue({ data: { on: jest.fn(), pipe: jest.fn() } }),
    },
  }),
};

export const drive_v3 = {};
