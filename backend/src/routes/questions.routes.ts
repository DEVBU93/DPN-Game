import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await prisma.question.findMany({
      where: req.query.missionId ? { missionId: req.query.missionId as string } : undefined,
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: questions });
  } catch (e) { next(e); }
});

router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await prisma.question.create({ data: req.body });
    res.status(201).json({ success: true, data: question });
  } catch (e) { next(e); }
});

export default router;
