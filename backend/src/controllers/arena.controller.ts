import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { v4 as uuidv4 } from 'uuid';


export const arenaController = {
  async findMatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Generate a room code for this player
      const roomCode = uuidv4().slice(0, 8).toUpperCase();
      const session = await prisma.arenaSession.create({
        data: {
          userId: req.user!.id,
          roomCode,
          isHost: true,
          status: 'ACTIVE'
        }
      });
      res.json({ success: true, data: { sessionId: session.id, roomCode, status: 'waiting' } });
    } catch (e) { next(e); }
  },

  async getMatchStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Normalize roomCode param (Express may type it as string | string[])
      const rawRoomCode = (req.params as any).roomCode;
      const roomCode = Array.isArray(rawRoomCode) ? rawRoomCode[0] : rawRoomCode;

      if (!roomCode) {
        return res.status(400).json({ success: false, error: 'Missing roomCode parameter' });
      }

      const sessions = await prisma.arenaSession.findMany({
        where: { roomCode },
        include: { user: { select: { id: true, username: true } } }
      });
      res.json({ success: true, data: sessions });
    } catch (e) { next(e); }
  },

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessions = await prisma.arenaSession.findMany({
        where: { userId: req.user!.id },
        orderBy: { startedAt: 'desc' },
        take: 10
      });
      res.json({ success: true, data: sessions });
    } catch (e) { next(e); }
  }
};
