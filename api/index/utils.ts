import { readFileSync } from 'fs';

function* readJsonl(filePath: string) {
  const text = readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim()) yield JSON.parse(line);
  }
}

export { readJsonl };
