import Express from 'express';
import type { Request, Response } from 'express';

const router = Express();

// TODO: Implement proper message storage and retrieval.
router.get('/messages', async (req: Request, res: Response) => {
  return res.json({ messages: [] });
});

export default router;
