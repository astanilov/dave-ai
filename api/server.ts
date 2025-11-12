import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import main from './ingest';
import embedIngestJsonl from './index/db/services/embed-ingest-rag-jsonl';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Dave AI API is running' });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Dave AI API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

// Run data ingestion on startup once
// TODO: Consider scheduling or triggering this differently in production
main()
  .then(async () => {
    await embedIngestJsonl();
  })
  .catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
  });
