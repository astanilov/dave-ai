import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import systemPrompt from '../prompts/system-prompt';

const INPUT_MESSAGES_KEY = 'input';

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o',
  temperature: 0.5,
});

const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(systemPrompt),
  HumanMessagePromptTemplate.fromTemplate(`{${INPUT_MESSAGES_KEY}}`),
]);

export async function getResponse(input: string, sessionId: string): Promise<string> {
  const response = await prompt.pipe(model).invoke(
    { [INPUT_MESSAGES_KEY]: input },
    { configurable: { sessionId } },
  );

  return response.text.trim();
}
