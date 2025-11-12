import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import ingest from './ingest';
import embedIngestJsonl from './index/db/services/embed-ingest-rag-jsonl';
import healthRoutes from './routes/health';
import askRoutes from './routes/ask';
import messagesRoutes from './routes/messages';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/api', healthRoutes);
app.use('/api', askRoutes);
app.use('/api', messagesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

// Run data ingestion on startup once
// TODO: Consider scheduling or triggering this differently in production
ingest()
  .then(async () => {
    await embedIngestJsonl();
  })
  .catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
  });
