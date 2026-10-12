import fs from 'node:fs/promises';
import path from 'node:path';
import { loadSnapshots } from './validate-api-snapshot.mjs';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content', 'docs');
const requested = new Set();
const files = [];

const walk = async (directory) => {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) files.push(fullPath);
  }
};
await walk(contentRoot);
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  for (const match of source.matchAll(/<ApiLink\s+id=["']([^"']+)["'][^>]*\/?\s*>/g)) requested.add(`${match[1]}\t${file}`);
}
const known = new Set();
for (const { snapshot } of await loadSnapshots()) for (const symbol of snapshot.symbols) {
  known.add(symbol.id);
  for (const member of symbol.members ?? []) known.add(member.id);
}
const missing = [...requested].filter((item) => !known.has(item.split('\t')[0]));
if (missing.length) {
  console.error('Unknown API links:\n' + missing.map((item) => `- ${item.replace('\t', ' in ')}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${requested.size} API link(s).`);
}
