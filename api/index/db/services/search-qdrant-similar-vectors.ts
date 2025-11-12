import cfg from '../../config';
import qDrantClient from '../clients/qdrant';

async function getSimilarVectorsFromQdrant(queryVec: number[], topK: number) {
  console.log('🔍 Searching for similar vectors in Qdrant...');
  try {
    const searchRes = await qDrantClient.search(
      cfg.qdrantCollection as string,
      {
        vector: queryVec,
        limit: topK,
        with_payload: true,
      }
    );

    console.log(`Found ${searchRes.length} similar vectors in Qdrant.`);
    return searchRes;
  } catch (error) {
    console.error('Error searching similar vectors in Qdrant:', error);
    throw error;
  }
}

export default getSimilarVectorsFromQdrant;
