import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '30d'
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

export const authService = {
  async register(dto: RegisterDTO) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] }
    });
    if (exists) {
      throw new AppError(
        exists.email === dto.email ? 'Email ya registrado' : 'Username ya en uso',
        409
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: hashedPassword,
        displayName: dto.displayName || dto.username,
        profile: { create: {} },
        progress: { create: {} }
      },
      select: { id: true, username: true, email: true, displayName: true, role: true, createdAt: true }
    });

    const tokens = generateTokens(user.id);
    logger.info(`Nuevo usuario registrado: ${user.username}`);
    return { user, ...tokens };
  },

  async login(dto: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, username: true, email: true, displayName: true, role: true, passwordHash: true, isActive: true, avatarUrl: true }
    });

    if (!user || !user.isActive) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const { passwordHash, ...userSafe } = user;
    const tokens = generateTokens(user.id);
    logger.info(`Login exitoso: ${user.username}`);
    return { user: userSafe, ...tokens };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user || !user.isActive) throw new AppError('Token inválido', 401);
      return generateTokens(user.id);
    } catch {
      throw new AppError('Refresh token inválido', 401);
    }
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, progress: true }
    });
    if (!user) throw new AppError('Usuario no encontrado', 404);
    const { passwordHash, ...userSafe } = user;
    return userSafe;
  }
};
