import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const missions = await prisma.mission.findMany({
      where: req.query.chapterId ? { chapterId: req.query.chapterId as string } : undefined,
      include: { questions: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: missions });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { order: 'asc' } } }
    });
    if (!mission) { res.status(404).json({ success: false, message: 'Misión no encontrada' }); return; }
    res.json({ success: true, data: mission });
  } catch (e) { next(e); }
});

export default router;
