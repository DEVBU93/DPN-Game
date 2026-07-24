import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapterId = Array.isArray(req.query.chapterId) ? req.query.chapterId[0] : req.query.chapterId;
    const missions = await prisma.mission.findMany({
      where: chapterId ? { chapterId: chapterId as string } : undefined,
      include: { questions: { orderBy: { createdAt: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: missions });
  } catch (e) { next(e); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { createdAt: 'asc' } } }
    });
    if (!mission) { res.status(404).json({ success: false, message: 'Mision no encontrada' }); return; }
    res.json({ success: true, data: mission });
  } catch (e) { next(e); }
});

export default router;
