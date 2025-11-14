import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import cfg from './config';

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: cfg.chunkSize,
  chunkOverlap: cfg.chunkOverlap,
});

export async function chunkText(text: string): Promise<string[]> {
  return textSplitter.splitText(text);
}

export async function toRagChunks(normalized: any): Promise<any[]> {
  const chunks = await chunkText(normalized.content_text);

  return chunks.map((text, idx) => ({
    id: `${normalized.source}:${normalized.id}#${idx + 1}`,
    text,
    metadata: {
      id: normalized.id,
      source: normalized.source,
      type: normalized.type,
      title: normalized.title,
      url: normalized.url,
      created_at: normalized.created_at,
      updated_at: normalized.updated_at,
      author: normalized.author,
      parent_id: `${normalized.source}:${normalized.id}`,
      // spread useful domain metadata but avoid collisions
      domain: normalized.metadata,
      // Optional: add routing hints for multi-tenant/vector dbs
      // tenant: 'quickbase',
      // space_or_channel: normalized.metadata.space || normalized.metadata.project || normalized.metadata.channel,
    },
  }));
}
