// src/infrastructure/repository/__tests__/UserRepository.test.ts
import { UserRepository } from '../UserRepository';
import { User } from '../../../models/User';

// Mock the Mongoose model
jest.mock('../../../models/User');

describe('UserRepository', () => {
  let repo: UserRepository;
  const mockUser = {
    _id: 'custom-id',
    id: 'custom-id',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed_password_8',
    role: 'user',
    isMfaEnabled: false,
    loginAttempts: 0,
    tokenVersion: 0,
    lastPasswordChange: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshTokens: [],
    save: jest.fn(),
  };
  mockUser.save.mockResolvedValue(mockUser);

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new UserRepository();
  });

  it('should create a user', async () => {
    // Mock the constructor behavior
    (User as any).mockImplementation(() => mockUser);

    const result = await repo.create('custom-id', mockUser as any);

    expect(User).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should find a user by email', async () => {
    const email = 'bob@example.com';
    const mockFindOne = {
      exec: jest.fn().mockResolvedValue({ ...mockUser, email }),
    };
    (User.findOne as jest.Mock).mockReturnValue(mockFindOne);

    const user = await repo.findByEmail(email);
    expect(user).not.toBeNull();
    expect(user?.email).toBe(email);
    expect(User.findOne).toHaveBeenCalledWith({ email });
  });

  it('should find a user by id', async () => {
    const mockFindById = {
      exec: jest.fn().mockResolvedValue(mockUser),
    };
    (User.findById as jest.Mock).mockReturnValue(mockFindById);

    const found = await repo.findById('custom-id');
    expect(found).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith('custom-id');
  });

  it('should update a user', async () => {
    const mockUpdate = {
      exec: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated Name' }),
    };
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue(mockUpdate);

    const updated = await repo.update('custom-id', { name: 'Updated Name' });
    expect(updated?.name).toBe('Updated Name');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      'custom-id',
      { name: 'Updated Name' },
      { new: true },
    );
  });

  it('should delete a user', async () => {
    const mockDelete = {
      exec: jest.fn().mockResolvedValue(true),
    };
    (User.findByIdAndDelete as jest.Mock).mockReturnValue(mockDelete);

    const result = await repo.delete('custom-id');
    expect(result).toBe(true);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('custom-id');
  });
});
