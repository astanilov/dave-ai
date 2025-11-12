import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import cfg from '../config';

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: cfg.openaiEmbeddingModel,
});

export async function initVectorStore(): Promise<QdrantVectorStore> {
  return QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: `http://${cfg.qdrantHost}:${cfg.qdrantPort}`,
      collectionName: cfg.qdrantCollection,
    }
  );
}