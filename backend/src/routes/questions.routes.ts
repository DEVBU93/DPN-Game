import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      where: req.query.missionId ? { missionId: req.query.missionId as string } : undefined,
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: questions });
  } catch (e) { next(e); }
});

router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const question = await prisma.question.create({ data: req.body });
    res.status(201).json({ success: true, data: question });
  } catch (e) { next(e); }
});

export default router;
