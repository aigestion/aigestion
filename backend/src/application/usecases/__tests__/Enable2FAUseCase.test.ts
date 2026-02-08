import 'reflect-metadata';
import { Enable2FAUseCase } from '../Enable2FAUseCase';
import { TwoFactorService } from '../../../services/two-factor.service';
import { User } from '../../../models/User';
import { AppError } from '../../../utils/errors';

jest.mock('../../../services/two-factor.service');
jest.mock('../../../models/User');

const MockTwoFactorService = TwoFactorService as jest.MockedClass<typeof TwoFactorService>;
const MockUser = User as jest.MockedClass<typeof User>;

describe('Enable2FAUseCase', () => {
  const userId = '12345';
  const email = 'test@example.com';
  const secret = 'SECRET';
  const qrCode = 'data:image/png;base64,QR';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if user not found', async () => {
    // Return a mock chain with .exec() that resolves to null
    MockUser.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    const useCase = new Enable2FAUseCase(new MockTwoFactorService());
    await expect(useCase.execute(userId)).rejects.toThrow(AppError);
  });
  // Temporarily skipped: Mock injection issue with InversifyJS
  it('should generate secret and QR code and save user', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const userMock = {
      _id: userId,
      id: userId,
      email,
      save: saveMock,
    } as any;

    // Mock User.findById chain
    MockUser.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(userMock),
    });

    // Create a manual mock instance
    const mockTwoFactorService = new MockTwoFactorService();
    mockTwoFactorService.generateTOTPSecret = jest.fn().mockResolvedValue({ secret, qrCode });

    const useCase = new Enable2FAUseCase(mockTwoFactorService);
    const result = await useCase.execute(userId);

    expect(result).toEqual({ secret, qrCode });
    expect(mockTwoFactorService.generateTOTPSecret).toHaveBeenCalledWith(userId, email);
    expect(userMock.twoFactorSecret).toBe(secret);
    expect(saveMock).toHaveBeenCalled();
  });
});
