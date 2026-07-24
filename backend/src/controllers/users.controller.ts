import { Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const usersController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = idParam ?? req.user!.id;
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
      const limit = parseInt(req.query.limit as string) || 10;
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
