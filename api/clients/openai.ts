import OpenAI from 'openai';
import cfg from './config';

if (!cfg.openaiApiKey) {
  throw new Error('OpenAI API key is missing in environment variables.');
}

const openai = new OpenAI({ apiKey: cfg.openaiApiKey });

export default openai;
