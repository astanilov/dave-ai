import axios from 'axios';
import cfg from '../../config';

if (!cfg.embeddingProvider || !cfg.ollamaModel) {
  throw new Error(
    'Embedding provider or Ollama model is not specified in environment variables.'
  );
}

async function embedBatch(texts: string[]) {
  try {
    if (cfg.embeddingProvider === 'ollama') {
      const model = cfg.ollamaModel || 'nomic-embed-text';
      const res = await axios.post('http://localhost:11434/api/embed', {
        model,
        input: texts,
      });
      if (res.status !== 200)
        throw new Error(`Ollama embed error: ${res.status} ${res.statusText}`);
      const data: any = res.data;
      // Ollama returns { embeddings: number[][] }
      return data.embeddings;
    }
  } catch (error) {
    console.error('Error during Ollama embedding:', error);
    throw error;
  }
}

export default embedBatch;
