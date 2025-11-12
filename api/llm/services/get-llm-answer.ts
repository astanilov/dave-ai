import axios from 'axios';
import getSimilarVectorsFromQdrant from '../../index/db/services/search-qdrant-similar-vectors';
import systemPrompt from '../../prompts/system-prompt';
import getQuestionEmbedding from './get-llm-embed-question';
import cfg from '../config';

if (!cfg.ollamaLlmModel) {
  throw new Error(
    'Ollama LLM model is not specified in environment variables.'
  );
}

async function askWithOllama(question: string) {
  console.log('❓ Question:', question);
  // 1️⃣ Generate embedding for the query using Ollama
  const queryVec = await getQuestionEmbedding(question);

  // 2️⃣ Search Qdrant for similar vectors
  const results = await getSimilarVectorsFromQdrant(queryVec, 5); // top 5

  if (results.length === 0) {
    console.log('No relevant context found in the database.');
    return {
      answer:
        'I could not find any relevant information to answer your question.',
      references: [],
    };
  }

  // 3️⃣ Build a prompt from top matches
  const snippets = results.map(r => r?.payload?.text || '').join('\n---\n');
  const prompt = `{top_k_chunks:\n${snippets}}\n\n{question: ${question}}\nAnswer:`;

  // 4️⃣ Ask Ollama (local GPT model, e.g. llama3 or mistral)
  const { data } = await axios.post('http://localhost:11434/api/chat', {
    model: cfg.ollamaLlmModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    stream: false,
  });
  const result = {
    answer: data.message.content,
    references: results.map(r => ({
      id: r.id,
      title: r?.payload?.title,
      url: r?.payload?.url,
      score: r.score,
    })),
  };

  console.log('🧠 Answer:\n', result.answer);
  console.log();
  console.log('🔗 References:\n', result.references);

  return result;
}

export default askWithOllama;
