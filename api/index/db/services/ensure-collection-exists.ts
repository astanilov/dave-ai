import cfg from '../../config';
import qdrant from '../clients/qdrant';

if (!cfg.qdrantCollection || !cfg.embeddingModelDims) {
  throw new Error(
    'Qdrant collection name or embedding model dimensions are not specified in environment variables.'
  );
}

async function ensureCollection() {
  try {
    await qdrant.createCollection(cfg.qdrantCollection as string, {
      vectors: { size: cfg.embeddingModelDims, distance: 'Cosine' },
    });
    console.log(
      `[Qdrant] Created collection '${cfg.qdrantCollection}' (size=${cfg.embeddingModelDims}, Cosine).`
    );
  } catch (e: Error | any) {
    const statusCode = e.status;
    if (statusCode === 409) {
      console.log(`[Qdrant] Collection '${cfg.qdrantCollection}' exists.`);
    } else {
      throw e;
    }
  }
}

export default ensureCollection;
