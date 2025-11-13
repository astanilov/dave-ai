import 'dotenv/config';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import askRoutes from './routes/ask';
import healthRoutes from './routes/health';
import messagesRoutes from './routes/messages';

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
