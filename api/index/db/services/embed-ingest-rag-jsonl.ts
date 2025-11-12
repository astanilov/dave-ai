import { v4 as uuidv4 } from 'uuid';
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
  const BATCH_SIZE = 128;

  console.log('🔍 Starting embedding and ingestion into Qdrant...');

  try {
    await ensureCollectionExists();

    const rows = Array.from(readJsonl(cfg.jsonlPath));

    console.log(`[JSONL] Loaded ${rows.length} rows from ${cfg.jsonlPath}`);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const items = rows.slice(i, i + BATCH_SIZE);
      const embeddings = await embedBatch(items.map(r => r.text || ''));
      const points = items.map(({ id, metadata, text }, j) => ({
        id: uuidv4(),
        vector: embeddings[j],
        payload: { ...(metadata || {}), text, id },
      }));

      await qdrant.upsert(cfg.qdrantCollection as string, { points });

      process.stdout.write(
        `Upserted ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}\r`
      );
    }

    process.stdout.write('\n');
    console.log('✅ Data embedding and DB ingestion completed successfully.');
  } catch (error) {
    console.error('Error during embedding and DB ingestion:', error);
  }
}

export default embedIngestJsonl;
