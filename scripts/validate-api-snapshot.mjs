import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const apiDir = path.join(root, 'data', 'api', 'latest');
const schemaVersion = 1;

export function validateSnapshot(snapshot, fileName = 'snapshot') {
  const errors = [];
  if (snapshot?.schemaVersion !== schemaVersion) errors.push('schemaVersion must be 1');
  for (const field of ['source', 'runtime']) {
    if (!snapshot?.[field] || typeof snapshot[field] !== 'object') errors.push(`${field} must be an object`);
  }
  for (const field of ['mod', 'modVersion', 'gitCommit']) {
    if (typeof snapshot?.source?.[field] !== 'string' || !snapshot.source[field]) errors.push(`source.${field} must be a non-empty string`);
  }
  for (const field of ['platform', 'minecraft', 'loader']) {
    if (typeof snapshot?.runtime?.[field] !== 'string' || !snapshot.runtime[field]) errors.push(`runtime.${field} must be a non-empty string`);
  }
  if (!Array.isArray(snapshot?.symbols)) errors.push('symbols must be an array');
  const ids = new Set();
  for (const [index, symbol] of (snapshot?.symbols ?? []).entries()) {
    const prefix = `${fileName}: symbols[${index}]`;
    if (!symbol || typeof symbol !== 'object') {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    for (const field of ['id', 'kind', 'name']) {
      if (typeof symbol[field] !== 'string' || !symbol[field]) errors.push(`${prefix}.${field} must be a non-empty string`);
    }
    if (ids.has(symbol.id)) errors.push(`${prefix}.id is duplicated: ${symbol.id}`);
    ids.add(symbol.id);
    if (!Array.isArray(symbol.availability)) errors.push(`${prefix}.availability must be an array`);
    for (const availability of symbol.availability ?? []) {
      if (typeof availability.platform !== 'string' || !Array.isArray(availability.sides)) errors.push(`${prefix}.availability entries need platform and sides`);
    }
  }
  return errors;
}

export async function loadSnapshots() {
  const files = (await fs.readdir(apiDir)).filter((file) => file.endsWith('.json')).sort();
  const snapshots = [];
  for (const file of files) {
    const fullPath = path.join(apiDir, file);
    const snapshot = JSON.parse(await fs.readFile(fullPath, 'utf8'));
    const errors = validateSnapshot(snapshot, file);
    if (errors.length) throw new Error(errors.join('\n'));
    snapshots.push({ file, snapshot });
  }
  if (!snapshots.length) throw new Error(`No API snapshots found in ${apiDir}`);
  return snapshots;
}

if (process.argv[1]?.endsWith('validate-api-snapshot.mjs')) {
  const snapshots = await loadSnapshots();
  console.log(`Validated ${snapshots.length} API snapshot(s).`);
}
