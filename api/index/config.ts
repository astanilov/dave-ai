import path from 'path';

const cfg = {
  qdrantHost: process.env.QDRANT_HOST,
  qdrantPort: Number(process.env.QDRANT_PORT),
  ollamaEmbeddingModel: process.env.OLLAMA_EMBED_MODEL,
  embeddingModelDims: Number(process.env.EMBEDDING_MODEL_DIMS),
  jsonlPath: path.join(process.cwd(), 'ingest/output', 'rag_corpus.jsonl'),
  qdrantCollection: process.env.QDRANT_COLLECTION,
};

export default cfg;
