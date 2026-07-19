import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId: req.user!.id }
    });
    res.json({ success: true, data: progress });
  } catch (e) { next(e); }
});

export default router;
