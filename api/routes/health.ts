import Express from 'express';

const router = Express();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dave AI API is running' });
});

export default router;
