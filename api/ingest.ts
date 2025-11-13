import 'dotenv/config';

import embedIngestJsonl from './index/db/services/embed-ingest-rag-jsonl';
import ingest from './ingest/index';

ingest()
  .then(embedIngestJsonl)
  .catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
  });
