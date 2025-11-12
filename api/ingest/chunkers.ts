import cfg from './config';

function chunkText(
  text: string,
  size = cfg.chunkSize,
  overlap = cfg.chunkOverlap
) {
  const chunks: string[] = [];
  const t = text || '';
  if (!t) return chunks;
  let i = 0;
  while (i < t.length) {
    const end = Math.min(t.length, i + size);
    const slice = t.slice(i, end);
    chunks.push(slice.trim());
    if (end >= t.length) break;
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter(Boolean);
}

function toRagChunks(normalized: any) {
  const chunks = chunkText(normalized.content_text);
  return chunks.map((text, idx) => ({
    id: `${normalized.source}:${normalized.id}#${idx + 1}`,
    text,
    metadata: {
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

export { chunkText, toRagChunks };
