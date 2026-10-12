# NekoJS Wiki

NekoJS 文档站的第一版可运行 vertical slice：Astro + Starlight、中文默认语言、英文 `/en/`、API 快照生成页、overlay、本地 Pagefind 搜索和示例类型检查。

## 本地开发

需要 Node.js 22+ 和 pnpm 10+：

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:4321/`。

## 检查与构建

```bash
pnpm validate:data
pnpm generate:api
pnpm check:api-links
pnpm check:examples
pnpm typecheck
pnpm build
```

`pnpm build` 会先校验并生成双语 API 页面，再执行 Astro 静态构建。生成目录 `src/content/docs/reference/api/generated/` 不应直接编辑。

## 目录约定

- `src/content/docs/`：手写中文页面；`src/content/docs/en/`：英文页面。
- `data/api/latest/`：从 NekoJS Probe 导出的运行时 API 快照。
- `data/overlays/`：按 symbol ID 维护中文和英文 API 说明。
- `scripts/`：快照校验、页面生成和 API 链接检查。
- `examples/`：参与 TypeScript 检查的示例源文件。
- `public/examples/`：发布到站点、可从 API 页面访问的示例文件。

## 设计资料

- [架构设计](ARCHITECTURE.md)：技术选型、信息架构、API 快照、生成流程、翻译、CI、部署和迁移路线。
- [领域词汇](CONTEXT.md)：文档系统中的稳定术语和不变量。
- [ADR 0001](docs/adr/0001-docs-platform.md)：选择 Astro Starlight 与 API 快照驱动方式的决策记录。

## 当前 vertical slice

示例快照包含 `binding:Utils`，可以在 [Utils API 页面](/reference/api/generated/utils/) 查看；示例代码位于 `examples/basic/random.ts`。下一阶段是在 NekoJS 主仓库实现 JSON Probe backend，并把真实 NeoForge/Cleanroom 快照同步到 `data/api/latest/`。
