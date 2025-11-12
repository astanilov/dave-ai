import openai from '../../../clients/openai';
import cfg from '../../config';

if (!cfg.openaiEmbeddingModel) {
  throw new Error(
    'OpenAI embedding model is not specified in environment variables.'
  );
}

async function embedBatch(texts: string[]) {
  const r = await openai.embeddings.create({
    model: cfg.openaiEmbeddingModel as string,
    input: texts,
  });
  return r.data.map(d => d.embedding);
}

export default embedBatch;
