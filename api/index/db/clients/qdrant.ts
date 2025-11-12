import { QdrantClient } from '@qdrant/js-client-rest';
import cfg from '../../config';

if (!cfg.qdrantHost || !cfg.qdrantPort) {
  throw new Error('Qdrant configuration is missing in environment variables.');
}

const qDrantClient = new QdrantClient({
  host: cfg.qdrantHost,
  port: cfg.qdrantPort,
});

export default qDrantClient;
