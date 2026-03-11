/**
 * Tests unitarios — authService
 * DevBuPlaytime Backend
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ── Mocks ──────────────────────────────────────────────────────
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

import { authService } from '../services/auth.service';
import { AppError } from '../middlewares/errorHandler';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// ── Setup ─────────────────────────────────────────────────────
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...OLD_ENV,
    JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long!',
    JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-32-chars!',
    JWT_EXPIRES_IN: '15m',
  };
});
afterAll(() => { process.env = OLD_ENV; });

// ── Helpers ───────────────────────────────────────────────────
const makeUser = (overrides = {}) => ({
  id: 'user-uuid-1234',
  username: 'devbu_test',
  email: 'test@devbuplaytime.com',
  displayName: 'Test Player',
  role: 'PLAYER',
  passwordHash: '$2a$12$hashedpassword',
  isActive: true,
  avatarUrl: null,
  createdAt: new Date(),
  ...overrides,
});

// ══════════════════════════════════════════════════════════════
describe('authService.register', () => {
  it('should create a new user and return tokens', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(makeUser());
    mockBcrypt.hash.mockResolvedValue('$2a$12$hashed' as never);
    mockJwt.sign.mockReturnValue('mock-access-token' as never);

    const result = await authService.register({
      username: 'devbu_test',
      email: 'test@devbuplaytime.com',
      password: 'Password123!',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('should throw 409 if email already exists', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findFirst.mockResolvedValue(makeUser({ email: 'test@devbuplaytime.com' }));

    await expect(authService.register({
      username: 'new_user',
      email: 'test@devbuplaytime.com',
      password: 'Password123!',
    })).rejects.toThrow(AppError);
  });

  it('should throw 409 if username already exists', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findFirst.mockResolvedValue(makeUser({ username: 'devbu_test' }));

    await expect(authService.register({
      username: 'devbu_test',
      email: 'new@example.com',
      password: 'Password123!',
    })).rejects.toThrow(AppError);
  });
});

// ══════════════════════════════════════════════════════════════
describe('authService.login', () => {
  it('should return tokens on valid credentials', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findUnique.mockResolvedValue(makeUser());
    prisma.user.update.mockResolvedValue(makeUser());
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockJwt.sign.mockReturnValue('mock-token' as never);

    const result = await authService.login({
      email: 'test@devbuplaytime.com',
      password: 'Password123!',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('should throw 401 on invalid password', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findUnique.mockResolvedValue(makeUser());
    mockBcrypt.compare.mockResolvedValue(false as never);

    await expect(authService.login({
      email: 'test@devbuplaytime.com',
      password: 'WrongPassword!',
    })).rejects.toThrow(AppError);
  });

  it('should throw 401 if user does not exist', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.login({
      email: 'noexiste@devbuplaytime.com',
      password: 'Password123!',
    })).rejects.toThrow(AppError);
  });

  it('should throw 401 if user is inactive', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    prisma.user.findUnique.mockResolvedValue(makeUser({ isActive: false }));

    await expect(authService.login({
      email: 'test@devbuplaytime.com',
      password: 'Password123!',
    })).rejects.toThrow(AppError);
  });
});

// ══════════════════════════════════════════════════════════════
describe('authService.refreshToken', () => {
  it('should return new tokens on valid refresh token', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new (PrismaClient as any)();
    mockJwt.verify.mockReturnValue({ userId: 'user-uuid-1234' } as never);
    prisma.user.findUnique.mockResolvedValue(makeUser());
    mockJwt.sign.mockReturnValue('new-token' as never);

    const result = await authService.refreshToken('valid-refresh-token');
    expect(result).toHaveProperty('accessToken');
  });

  it('should throw 401 on invalid refresh token', async () => {
    mockJwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    await expect(authService.refreshToken('bad-token')).rejects.toThrow(AppError);
  });
});
