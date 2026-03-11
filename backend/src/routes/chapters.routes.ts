import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const chapters = await prisma.chapter.findMany({
      where: req.query.worldId ? { worldId: req.query.worldId as string } : undefined,
      include: { missions: true },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: chapters });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: req.params.id },
      include: { missions: { include: { questions: true } } }
    });
    if (!chapter) { res.status(404).json({ success: false, message: 'Capítulo no encontrado' }); return; }
    res.json({ success: true, data: chapter });
  } catch (e) { next(e); }
});

export default router;
