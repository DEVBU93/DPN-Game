import { Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const usersController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const idRaw = (req.params as any).id;
      const id = Array.isArray(idRaw) ? idRaw[0] : idRaw ?? req.user!.id;
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
      const limitRaw = (req.query as any).limit;
      const limitStr = Array.isArray(limitRaw) ? limitRaw[0] : limitRaw;
      const limit = parseInt(limitStr || '10') || 10;
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
