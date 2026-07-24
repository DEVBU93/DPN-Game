import { Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { singleParam } from '../lib/params';

export const usersController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = singleParam(req.params.id) ?? req.user!.id;
      const user = await usersService.findById(id);
      res.json({ success: true, data: user });
    } catch (e) { next(e); }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await usersService.updateProfile(req.user!.id, req.body);
      res.json({ success: true, data: updated });
    } catch (e) { next(e); }
  },

  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limitStr = singleParam((req.query as any).limit) ?? '10';
      const limit = parseInt(limitStr) || 10;
      const board = await usersService.getLeaderboard(limit);
      res.json({ success: true, data: board });
    } catch (e) { next(e); }
  },

  async getCosmetics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cosmetics = await usersService.getUserCosmetics(req.user!.id);
      res.json({ success: true, data: cosmetics });
    } catch (e) { next(e); }
  }
};
