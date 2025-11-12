import { mkdirSync } from "fs";
import path from "path";

const outDir = path.join(__dirname, 'output');
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'rag_corpus.jsonl');

export { outDir, outFile };