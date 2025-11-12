import cfg from '../../config';
import embedBatch from '../../embed/services/batch-embedding';
import { readJsonl } from '../../utils';
import qdrant from '../clients/qdrant';
import ensureCollectionExists from './ensure-collection-exists';

if (!cfg.qdrantCollection) {
  throw new Error(
    'Qdrant collection name is not specified in environment variables.'
  );
}

async function embedIngestJsonl() {
  console.log('🔍 Starting embedding and ingestion into Qdrant...');
  try {
    await ensureCollectionExists();
    const BATCH = 128;
    const rows = Array.from(readJsonl(cfg.jsonlPath));
    console.log(`[JSONL] Loaded ${rows.length} rows from ${cfg.jsonlPath}`);

    for (let i = 0; i < rows.length; i += BATCH) {
      const slice = rows.slice(i, i + BATCH);
      const embeddings = await embedBatch(slice.map(r => r.text || ''));
      const points = slice.map((r, j) => ({
        id: r.id,
        vector: embeddings[j],
        payload: { ...(r.metadata || {}), text: r.text, id: r.id },
      }));
      await qdrant.upsert(cfg.qdrantCollection as string, { points });
      process.stdout.write(
        `Upserted ${Math.min(i + BATCH, rows.length)}/${rows.length}\r`
      );
    }
    process.stdout.write('\n');
    console.log('✅ Data embedding and DB ingestion completed successfully.');
  } catch (error) {
    console.error('Error during embedding and DB ingestion:', error);
  }
}

export default embedIngestJsonl;
