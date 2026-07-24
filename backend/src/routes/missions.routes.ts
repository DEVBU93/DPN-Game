import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { singleParam } from '../lib/params';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapterId = singleParam((req.query as any).chapterId);

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
    const id = singleParam(req.params.id);

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { questions: { orderBy: { createdAt: 'asc' } } }
    });
    if (!mission) { res.status(404).json({ success: false, message: 'Mision no encontrada' }); return; }
    res.json({ success: true, data: mission });
  } catch (e) { next(e); }
});

export default router;
