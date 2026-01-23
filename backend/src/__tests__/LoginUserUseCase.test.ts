
import 'reflect-metadata';
import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import { AppError } from '../utils/errors';
import bcrypt from 'bcryptjs';

// Mock dependencies
const mockUserRepository = {
    findByEmail: jest.fn(),
    update: jest.fn(),
};

// Mock config
jest.mock('../config', () => ({
    config: {
        jwt: {
            secret: 'test-secret',
            expiresIn: '1h',
            refreshTokenExpiresIn: '7d',
        }
    },
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        loginUserUseCase = new LoginUserUseCase(mockUserRepository as any);
    });

    const email = 'test@example.com';
    const password = 'password123';
    const ip = '127.0.0.1';
    const userAgent = 'test-agent';
    const hashedPassword = '$2a$10$hashedpassword';
    const userId = 'user-123';

    it('should throw error if user not found', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(loginUserUseCase.execute({ email, password, ip, userAgent }))
            .rejects.toThrow(new AppError('Credenciales inválidas', 401, 'AUTH_ERROR'));
    });

    it('should throw error if password does not match', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
            id: userId,
            password: hashedPassword,
            loginAttempts: 0,
            lockUntil: undefined,
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        mockUserRepository.update.mockResolvedValue({});

        await expect(loginUserUseCase.execute({ email, password, ip, userAgent }))
            .rejects.toThrow(new AppError('Credenciales inválidas', 401, 'AUTH_ERROR'));

        expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should return mfaRequired if 2FA is enabled', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
            id: userId,
            _id: userId,
            email,
            password: hashedPassword,
            loginAttempts: 0,
            lockUntil: undefined,
            isTwoFactorEnabled: true,
            refreshTokens: [],
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        mockUserRepository.update.mockResolvedValue({});

        const result = await loginUserUseCase.execute({ email, password, ip, userAgent });

        expect(result).toEqual({
            user: { _id: userId, email },
            mfaRequired: true
        });
    });

    it('should return tokens if 2FA is disabled', async () => {
        const mockUser = {
            id: userId,
            _id: userId,
            email,
            password: hashedPassword,
            loginAttempts: 0,
            lockUntil: undefined,
            isTwoFactorEnabled: false,
            refreshTokens: [],
            role: 'user',
        };
        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        mockUserRepository.update.mockResolvedValue(mockUser);

        const result = await loginUserUseCase.execute({ email, password, ip, userAgent });

        expect(result).toHaveProperty('token');
        expect(result).toHaveProperty('refreshToken');
        expect(result).not.toHaveProperty('mfaRequired');
    });
});
