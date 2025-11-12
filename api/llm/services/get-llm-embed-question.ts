import axios from 'axios';
import cfg from '../config';

if (!cfg.ollamaEmbeddingModel) {
  throw new Error(
    'Ollama embedding model is not specified in environment variables.'
  );
}

async function getQuestionEmbedding(question: string) {
  console.log('Generating embedding for question:', question);
  try {
    const embedRes = await axios.post('http://localhost:11434/api/embed', {
      model: cfg.ollamaEmbeddingModel,
      input: [question],
    });
    const { embeddings } = embedRes.data;

    console.log('Embedding generated - length:', embeddings[0].length);
    return embeddings[0];
  } catch (error) {
    console.error('Error fetching question embedding:', error);
    throw error;
  }
}

export default getQuestionEmbedding;
