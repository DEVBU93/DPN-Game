import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapterIdRaw = (req.query as any).chapterId;
    const chapterId = Array.isArray(chapterIdRaw) ? chapterIdRaw[0] : chapterIdRaw;

    const missions = await prisma.mission.findMany({
      where: chapterId ? { chapterId } : undefined,
      include: { questions: { orderBy: { createdAt: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: missions });
  } catch (e) { next(e); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idRaw = (req.params as any).id;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { questions: { orderBy: { createdAt: 'asc' } } }
    });
    if (!mission) { res.status(404).json({ success: false, message: 'Mision no encontrada' }); return; }
    res.json({ success: true, data: mission });
  } catch (e) { next(e); }
});

export default router;
