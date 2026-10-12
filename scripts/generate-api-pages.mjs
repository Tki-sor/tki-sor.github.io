import fs from 'node:fs/promises';
import path from 'node:path';
import { loadSnapshots } from './validate-api-snapshot.mjs';

const root = process.cwd();
const docsRoot = path.join(root, 'src', 'content', 'docs');
const generatedRoot = path.join(docsRoot, 'reference', 'api', 'generated');
const overlaysRoot = path.join(root, 'data', 'overlays');

const slugify = (value) => value
  .toLowerCase()
  .replaceAll(/[^a-z0-9]+/g, '-')
  .replaceAll(/^-|-$/g, '');

const escapeMarkdown = (value = '') => String(value)
  .replaceAll('\\', '\\\\')
  .replaceAll('`', '\\`');

const readOverlay = async (locale) => {
  const file = path.join(overlaysRoot, locale, 'bindings.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
};

const mergeSnapshots = (entries) => {
  const merged = new Map();
  for (const { snapshot } of entries) {
    for (const symbol of snapshot.symbols) {
      const current = merged.get(symbol.id);
      if (!current) {
        merged.set(symbol.id, {
          ...symbol,
          availability: [...symbol.availability],
          members: [...(symbol.members ?? [])],
          sources: [snapshot.runtime.platform]
        });
        continue;
      }
      current.availability.push(...symbol.availability);
      current.sources.push(snapshot.runtime.platform);
      const memberIds = new Set(current.members.map((member) => member.id));
      for (const member of symbol.members ?? []) if (!memberIds.has(member.id)) current.members.push(member);
    }
  }
  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
};

const availabilityLine = (symbol) => {
  const platforms = [...new Set(symbol.availability.map((entry) => entry.platform))].join(', ');
  const sides = [...new Set(symbol.availability.flatMap((entry) => entry.sides))].join(', ');
  return `> **平台**：${platforms}  \n> **脚本侧**：${sides}`;
};

const renderSymbol = (symbol, overlay, locale, entries) => {
  const localized = overlay[symbol.id] ?? {};
  const title = localized.title ?? symbol.name;
  const description = localized.summary ?? symbol.description ?? '暂无说明。';
  const memberRows = symbol.members.length
    ? symbol.members.map((member) => {
        const memberOverlay = overlay[member.id] ?? {};
        const params = (member.parameters ?? []).map((parameter) => `${parameter.name}: ${parameter.type}`).join(', ');
        const signature = `${member.name}(${params})${member.returns ? `: ${member.returns}` : ''}`;
        return `| \`${signature}\` | ${escapeMarkdown(memberOverlay.summary ?? member.description ?? '')} |`;
      }).join('\n')
    : '| 暂无公开成员 | |';
  const notes = (localized.notes ?? []).map((note) => `- ${note}`).join('\n');
  const examples = (localized.examples ?? []).map((example) => `- [${example}](/${example})`).join('\n');
  const sourceCommit = entries.map(({ snapshot }) => snapshot.source.gitCommit).join(', ');
  const englishNote = locale === 'en' ? '' : '\n> API 签名由运行时快照生成；页面说明来自文档 overlay。\n';
  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
type: reference
status: preview
sidebar:
  label: ${JSON.stringify(title)}
  order: 10
platforms: ${JSON.stringify([...new Set(symbol.availability.map((entry) => entry.platform))])}
sides: ${JSON.stringify([...new Set(symbol.availability.flatMap((entry) => entry.sides))])}
symbolId: ${JSON.stringify(symbol.id)}
---

# ${title}

${description}

${availabilityLine(symbol)}
${englishNote}
## 使用方式

${'```'}ts
${symbol.name}.${symbol.members[0]?.name ?? '/* member */'}(${(symbol.members[0]?.parameters ?? []).map((parameter) => parameter.name).join(', ')});
${'```'}

## 成员

| 成员 | 说明 |
| --- | --- |
${memberRows}

${notes ? `## 注意事项\n\n${notes}\n` : ''}
${examples ? `## 示例\n\n${examples}\n` : ''}
## 来源

- **Symbol ID**：\`${symbol.id}\`
- **快照来源**：\`${[...new Set(symbol.sources)].join('`, `')}\`
- **源 commit**：\`${sourceCommit}\`
`;
};

const writeLocale = async (locale, symbols, overlay, entries) => {
  const target = locale === 'en' ? path.join(generatedRoot, '..', '..', '..', 'en', 'reference', 'api', 'generated') : generatedRoot;
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(target, { recursive: true });
  for (const symbol of symbols) {
    const fileName = `${slugify(symbol.name)}.mdx`;
    await fs.writeFile(path.join(target, fileName), renderSymbol(symbol, overlay, locale, entries), 'utf8');
  }
};

const entries = await loadSnapshots();
const symbols = mergeSnapshots(entries).filter((symbol) => ['binding', 'global', 'event', 'handler', 'type', 'registry', 'adapter'].includes(symbol.kind));
const [zhOverlay, enOverlay] = await Promise.all([readOverlay('zh-CN'), readOverlay('en')]);
await writeLocale('zh-CN', symbols, zhOverlay, entries);
await writeLocale('en', symbols, enOverlay, entries);
console.log(`Generated ${symbols.length} API page(s) for zh-CN and en.`);
