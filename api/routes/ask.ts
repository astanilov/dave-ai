import Express from 'express';
import askWithOllama from '../llm/services/get-llm-answer';

const router = Express();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await askWithOllama(question);
    res.json({ ...answer });
  } catch (error) {
    console.log('Error in /ask route:', error);
    res.status(500).json({ error: 'Failed to get answer from LLM' });
  }
});

export default router;
