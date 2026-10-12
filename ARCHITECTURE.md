# NekoJS Wiki 架构设计

> 状态：提案（Proposal）  
> 更新时间：2026-10-06  
> 适用项目：NekoJS 及其官方/社区扩展

## 1. 目标与非目标

### 1.1 目标

Wiki 需要同时服务四类读者：

1. **脚本作者**：希望快速安装、编写第一个脚本、查事件和全局绑定。
2. **整合包作者**：关心脚本生命周期、配方、注册内容、模块和跨平台差异。
3. **插件/扩展作者**：关心 Java 扩展点、类型适配器、事件扩展和 Probe。
4. **NekoJS 贡献者**：关心架构、构建、测试、发布和文档工作流。

核心目标：

- 中文优先，同时维护英文版本。
- API 参考尽可能由 NekoJS 运行时自动生成，避免手工抄写 API。
- 手写教程、指南、概念解释和 API 补充说明保持良好的编辑体验。
- 支持 NeoForge 多版本和 Cleanroom，而不复制整套文档树。
- 新增页面只需创建一个带模板的 Markdown/MDX 文件。
- API、链接、示例、翻译状态能在 CI 中自动检查。
- 内容源、生成数据和网站实现分层，未来可以更换站点框架或部署平台。
- 对 AI/搜索工具友好，提供稳定 URL、原始 Markdown 和结构化 API 数据。

### 1.2 非目标

第一阶段不做：

- 在线 CMS 或浏览器内编辑器。
- 在浏览器中运行真实 Minecraft 脚本。
- 生成所有 `net.minecraft` 类的百科全书。
- 为每个 Minecraft 小版本复制一份完整文档树。
- 把所有第三方 Mod 的 API 自动纳入官方参考。
- 以 GitHub Wiki 作为最终发布形态。

### 1.3 成功标准

第一阶段完成后，应满足：

- 新增一个指南页面只需要复制模板、填写 frontmatter、写 Markdown。
- NekoJS 新增一个绑定或事件后，发布流程可以产出 API 快照并自动生成参考页。
- API 参考页能标出平台、Minecraft 版本、脚本侧（startup/server/client/test）和可用状态。
- 一个 API 成员被删除、改名或变更参数时，CI 能指出受影响的页面和示例。
- 中文页变更后，英文页能显示过期状态；不会静默继续展示旧翻译。
- 构建失败时，错误能指向具体的页面、符号 ID 或示例文件。

## 2. 推荐方案摘要

| 层 | 推荐 | 选择理由 |
|---|---|---|
| 文档站 | Astro + Starlight | Markdown/MDX 优先、内容集合校验、可访问性、国际化、静态部署 |
| 内容格式 | Markdown 为主，MDX 仅用于少量交互组件 | 降低认知负担，避免把页面写成前端代码 |
| 语言 | TypeScript | 生成器、schema、Astro 配置和 CI 工具使用同一语言 |
| 搜索 | Pagefind | 构建时索引、无外部服务、适合静态站；中文使用 `lang="zh-CN"` 分词 |
| API 数据 | NekoJS ProbeBackend 输出版本化 JSON | 复用 NekoJS 的 catalog snapshot 和 Probe IR，保持运行时/类型/文档一致 |
| API 页面 | 构建前生成 Markdown/MDX | 让 Starlight 原生处理路由、目录、搜索和 sitemap；生成页不手工编辑 |
| 手写覆盖 | 按稳定 symbol ID 的 JSON/YAML/Markdown overlay | 运行时命名变化时可检测，且不修改生成数据 |
| 翻译追踪 | source revision 元数据 + drift checker；后续可评估 Lunaria | 适配现有 `wiki/en_us` 的漂移检查习惯 |
| 部署 | Cloudflare Pages 主站，保留静态产物镜像能力 | PR 预览方便，静态站可迁移；面向中国用户时可再接国内镜像/CDN |
| 版本策略 | 单一 latest + 平台/版本可用性矩阵 | 避免现在就复制多套文档；重大 breaking release 再启用文档版本 |

推荐理由并不是 Starlight 本身提供所有领域能力，而是它在内容集合、页面元数据、静态构建和主题可访问性方面提供了一个较深的文档模块。API 快照、页面生成、翻译检查和示例检查应当作为独立模块，不能把所有逻辑塞进 Astro 配置。

## 3. 为什么不把 GitHub Wiki 作为最终系统

现有 `wiki/` 内容可以继续作为迁移输入，但 GitHub Wiki 不适合作为长期发布系统：

- 缺少可靠的 frontmatter schema 校验。
- API 生成页、平台矩阵和自定义组件难以统一。
- 站内搜索、版本、翻译状态和构建失败反馈能力有限。
- 内容和展示耦合在一个特殊 Git 仓库中，不利于本地预览和 CI。
- Markdown 链接、文件名和 URL 规则会限制后续信息架构。

迁移时保留原始页面内容和 Git 历史价值，但把它们移动到文档站的内容源目录，逐步修正链接和元数据。

## 4. 领域模型

### 4.1 核心对象

| 对象 | 含义 | 是否手工维护 |
|---|---|---|
| 文档页（Document） | 教程、指南、概念、参考说明等面向人的页面 | 是 |
| API 快照（API Snapshot） | 某个 NekoJS/MC/平台组合在一次运行时采集到的公开脚本表面 | 否，来自 Probe |
| API 符号（API Symbol） | 快照中可以稳定链接的绑定、事件、类型、方法或注册表 | 由 Probe 生成 ID |
| 覆盖说明（Overlay） | 针对 API 符号的中文说明、示例、注意事项和翻译 | 是 |
| 可用性（Availability） | 符号在哪个平台、MC 版本、脚本侧、依赖条件下可用 | 快照为主，人工可补充限制 |
| 示例（Example） | 展示某个工作流的代码或完整脚本 | 是；可选纳入检查 |
| 翻译记录（Translation Record） | 翻译页对应的源页 revision 和当前状态 | 自动检查，人工修订 |

### 4.2 不变量

- API 符号 ID 不得依赖中文显示名。
- 生成页不能成为 API 事实的第二个来源。
- 手写 overlay 不能改变运行时签名；它只能补充解释、示例、警告或本地化文本。
- 一个文档页必须声明其内容类别和受支持的平台范围；不适用时使用明确的 `all`，不能省略后猜测。
- 示例中的标识符必须来自对应 API 快照或明确标记为外部 JavaScript/Node API。
- 英文翻译页必须记录它基于哪一次中文页 revision；没有记录就视为需要人工检查。
- 任何生成操作都必须是幂等的：相同快照和 overlay 产生相同页面内容。

### 4.3 API 符号 ID

建议格式：

```text
binding:Utils
global:JsonIO
event:server/ServerEvents
handler:recipe/minecraft/crafting_shaped
type:com.tkisor.nekojs.api.wrapper.ItemStackJS
type:net.minecraft.world.item.ItemStack
member:com.tkisor.nekojs.api.wrapper.ItemStackJS#id()
member:com.tkisor.nekojs.api.wrapper.ItemStackJS#withCount(java.lang.Integer)
registry:item
adapter:item-stack
```

规则：

1. 名称使用运行时对脚本公开的名字，而不是 Java 私有实现名。
2. 方法 ID 包含声明类型、公开方法名和规范化参数类型。
3. 重载必须可以区分；参数名不参与 ID。
4. ID 一旦发布，改名时应保留 `aliases`，并生成迁移提示。
5. 平台不是 ID 的一部分；平台差异放在 `availability`，这样跨平台相同符号能共享页面。
6. 第三方扩展应使用 `source` 前缀或命名空间避免冲突，例如 `addon:files-njs/binding:Files`。

## 5. 内容信息架构

使用 Diátaxis 作为内容分类，但不要让分类成为用户必须理解的术语。导航使用读者语言，frontmatter 使用稳定枚举。

```text
首页
├── 开始使用
│   ├── 安装与前置
│   ├── 第一个脚本
│   ├── 目录结构
│   ├── 编辑器与类型提示
│   └── 从 KubeJS 迁移
├── 指南
│   ├── 脚本与模块
│   ├── 事件与命令
│   ├── 配方与数据
│   ├── 注册物品/方块/流体
│   ├── 客户端脚本
│   ├── TypeScript、JSX 与 Python
│   ├── Node.js 兼容模块
│   ├── JEI/REI/EMI 集成边界
│   └── 常见工作流
├── 概念
│   ├── 生命周期与脚本侧
│   ├── ESM、CJS 与 Java 模块
│   ├── reload 的边界
│   ├── 沙盒与安全模型
│   ├── 类型生成与 Probe
│   └── NeoForge/Cleanroom 差异
├── API 参考
│   ├── 全局绑定
│   ├── 事件
│   ├── 配方处理器
│   ├── 注册器与 Builder
│   ├── 类型与扩展方法
│   ├── 命令与配置
│   └── 平台差异
├── 示例与 Cookbook
├── 插件开发
│   ├── 插件入门
   ├── 全局绑定
   ├── 类型适配器
   ├── 事件扩展
   ├── 注解体系
   ├── 自定义 Probe backend
   └── JavaDoc/内部接口
├── 贡献指南
│   ├── 项目架构
│   ├── 构建与测试
│   ├── 文档规范
│   ├── 翻译流程
│   └── 发布流程
└── 更新日志与迁移
```

第一阶段不要把所有 `net.minecraft` 类生成成页面。只生成：

- NekoJS 全局绑定和事件入口。
- NekoJS 自己的 wrapper、adapter 和 host extension。
- 配方命名空间及处理器。
- 被公开脚本表面直接引用且有文档价值的类型。
- 具备完整可用性信息的注册表和特殊类型。

普通 Minecraft/NeoForge 类在 API 页面中以链接、签名和摘要出现；需要完整 Java API 时链接到外部 JavaDoc 或官方资料。

## 6. 仓库布局

推荐把 Wiki 放在独立仓库 `NekoJS-Docs`。NekoJS 主仓库负责运行时事实和快照生产，Wiki 仓库负责面向用户的内容和发布。

```text
NekoJS-Docs/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── preview.yml
│   │   ├── sync-api-snapshot.yml
│   │   └── translation-report.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docs/
│   ├── architecture.md
│   └── adr/
├── scripts/
│   ├── generate-api-pages.ts
│   ├── validate-api-snapshot.ts
│   ├── check-api-links.ts
│   ├── check-translation-drift.ts
│   ├── check-examples.ts
│   └── new-page.ts
├── data/
│   ├── api/
│   │   ├── schema/api-snapshot.schema.json
│   │   ├── latest/
│   │   │   ├── neo-1.21.1.json
│   │   │   ├── neo-26.1.json
│   │   │   ├── neo-26.2.json
│   │   │   └── cleanroom-1.12.2.json
│   │   └── manifest.json
│   ├── overlays/
│   │   ├── zh-CN/
│   │   │   ├── bindings.json
│   │   │   ├── events.json
│   │   │   └── members.json
│   │   └── en/
│   └── redirects.json
├── examples/
│   ├── basic/
│   ├── recipes/
│   ├── registration/
│   ├── events/
│   └── migration-kubejs/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx
│   │       ├── zh-cn/
│   │       │   ├── getting-started/
│   │       │   ├── guides/
│   │       │   ├── concepts/
│   │       │   ├── reference/
│   │       │   │   ├── api/
│   │       │   │   └── manual/
│   │       │   ├── cookbook/
│   │       │   ├── plugin-dev/
│   │       │   └── contributing/
│   │       └── en/
│   │           └── 同样的逻辑结构
│   ├── components/
│   │   ├── ApiLink.astro
│   │   ├── Availability.astro
│   │   ├── CodeTabs.astro
│   │   ├── Since.astro
│   │   └── TranslationStatus.astro
│   ├── styles/
│   └── content.config.ts
├── astro.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.mjs
├── .editorconfig
├── .gitignore
└── README.md
```

如果希望初期降低跨仓库同步成本，也可以先把站点放进 NekoJS 主仓库的 `docs-site/` 子目录。无论仓库位置如何，`data/api`、`data/overlays`、`src/content/docs` 和生成器接口都应保持相同，未来迁移只移动仓库而不重写内容。

## 7. Frontmatter 契约

所有手写页面使用严格 schema。下面是建议的最小字段：

```yaml
---
title: 修改配方
description: 使用脚本添加、删除和修改配方。
type: guide
status: stable
sidebar:
  label: 修改配方
  order: 20
platforms: [neoforge-1.21.1, neoforge-26.1, neoforge-26.2, cleanroom-1.12.2]
sides: [server]
minNekojs: 1.0.0
keywords: [recipe, 配方, server_scripts]
---
```

字段约定：

| 字段 | 必填 | 允许值/含义 |
|---|---:|---|
| `title` | 是 | 页面标题；中文页和英文页分别写 |
| `description` | 是 | 用于 SEO、列表和搜索摘要 |
| `type` | 是 | `tutorial`、`guide`、`concept`、`reference`、`cookbook`、`contributing` |
| `status` | 是 | `draft`、`preview`、`stable`、`deprecated` |
| `platforms` | 是 | 平台 ID 数组；通用页面写 `all` |
| `sides` | 参考页建议必填 | `startup`、`server`、`client`、`test`、`all` |
| `minNekojs` | 推荐 | 最早支持的 NekoJS 版本 |
| `since` | 可选 | 功能首次出现版本 |
| `deprecatedSince` | 可选 | 废弃版本 |
| `replacement` | 可选 | 替代符号或页面 URL |
| `keywords` | 推荐 | 中文、英文、API 名称和常用别名 |
| `translationOf` | 英文页必填 | 对应中文页面的稳定页面 ID |
| `sourceRevision` | 英文页必填 | 中文源页的 commit 或内容 hash |

Schema 校验应禁止未知字段，防止 frontmatter 慢慢变成无约束的字典。

## 8. API 快照架构

### 8.1 生产位置

API 快照的生产代码应放在 NekoJS 主仓库，因为只有运行时本身能保证：

- catalog 已经完成 bootstrap。
- 注册表、事件和绑定已经加载。
- 平台特定实现可被正确识别。
- `TypeReflector` 看到的公开名、隐藏成员和文档注解与运行时一致。
- 现有 `ProbeBackend` 机制可以复用，不需要另造一套反射器。

新增一个 `docs:json` 语言/backend，或者新增一个不影响既有 TS/Python 产物的 JSON backend。它只输出数据，不负责写网页。

接口应该接近：

```java
interface DocsSnapshotBackend {
    String language();       // "docs"
    String name();           // "json"
    boolean requiresIr();   // true
    Map<String, String> render(DocsSnapshotContext context);
}
```

`render` 的输出只包含相对路径到 UTF-8 内容的映射，例如：

```text
manifest.json
api-snapshot.json
types/decls.json
```

落盘、陈旧文件清理和路径校验继续使用现有 Probe 输出提交模块。

### 8.2 快照 JSON 结构

建议使用显式 `schemaVersion`，不要让网站直接依赖 Java 序列化结果：

```json
{
  "$schema": "https://nekojs.dev/schemas/api-snapshot.schema.json",
  "schemaVersion": 1,
  "source": {
    "mod": "nekojs",
    "modVersion": "1.1.0-preview3",
    "gitCommit": "abc1234",
    "generatedAt": "2026-10-06T12:00:00Z"
  },
  "runtime": {
    "platform": "neoforge-26.1",
    "minecraft": "26.1",
    "loader": "neoforge",
    "language": ["javascript", "typescript", "python"]
  },
  "bindings": [],
  "events": [],
  "types": [],
  "handlers": [],
  "registries": [],
  "adapters": [],
  "globals": [],
  "snippets": []
}
```

每个符号至少包含：

```json
{
  "id": "binding:Utils",
  "kind": "binding",
  "name": "Utils",
  "qualifiedName": "com.tkisor.nekojs.api.UtilsJS",
  "description": "...",
  "docs": {
    "english": "..."
  },
  "availability": [
    {
      "platform": "neoforge-26.1",
      "sides": ["server", "client"],
      "requiredMods": []
    }
  ],
  "members": [],
  "aliases": []
}
```

方法成员还应包含：

- `publicName`
- `parameters`: `name`, `type`, `optional`, `default`
- `returns`
- `throws`（如果能稳定获得）
- `overloadGroup`
- `deprecated`
- `since`
- `examples`（只放稳定的示例 ID，不直接塞长文本）

不要把 Java 泛型或反射细节原样暴露给站点。JSON 是跨工具契约，类型应表示脚本作者看到的类型。

### 8.3 多平台合并

网站读取多个快照时按 `id` 合并：

1. `id` 相同且脚本表面相同：合并 availability。
2. `id` 相同但签名不同：保留平台分支，在页面生成参数矩阵，并在 CI 报告差异。
3. 只存在于一个平台：页面保留，显示平台徽章。
4. 旧快照中存在、新快照消失：标记为 removed，只有在确认后才从 latest 页面隐藏。
5. 同一 API 由不同来源提供：以 `source` 和 `provider` 区分，禁止静默覆盖。

这能覆盖 NeoForge 26.x、NeoForge 1.21.1 和 Cleanroom 1.12.2，而不需要三套手工文档。

## 9. Overlay 设计

生成数据只描述“运行时有什么”。Overlay 描述“用户如何理解和使用它”。

建议每个语言一个 JSON 文件，按 symbol ID 索引：

```json
{
  "binding:Utils": {
    "title": "工具函数",
    "summary": "提供脚本中常用的随机数、转换和调试工具。",
    "notes": [
      "该绑定在所有脚本侧可用。"
    ],
    "examples": ["examples/basic/random.ts"],
    "links": ["guide:script-basics"],
    "translationStatus": "complete"
  },
  "member:com.tkisor.nekojs.api.UtilsJS#randomInt(java.lang.Integer,java.lang.Integer)": {
    "title": "生成随机整数",
    "summary": "返回闭区间内的随机整数。"
  }
}
```

Overlay 处理规则：

- `summary`、`title`、`notes` 和 `examples` 可以覆盖或补充自动生成内容。
- 参数类型、返回类型、可用性不能被 overlay 改写。
- overlay 引用不存在的 symbol ID 时构建失败。
- overlay 没有翻译时，中文使用空缺检查；英文可以暂时 fallback 到英文自动文档，但页面必须显示未翻译状态。
- 对不适合放 JSON 的长篇说明，使用手写 API note 页面，并在 frontmatter 中声明 `symbols` 关联 ID。

## 10. API 页面生成

### 10.1 生成时机

网站 build 前执行：

```text
validate snapshots
    -> merge platform snapshots
    -> validate overlays and aliases
    -> generate symbol index
    -> generate API MDX pages
    -> validate internal/API links
    -> Astro/Starlight build
    -> Pagefind index
```

生成目录应加入 `.gitignore`。CI 需要在生成前清理上次产物，避免已经删除的符号留下陈旧页面。

### 10.2 页面形态

一个典型 API 页面包含：

1. 名称、稳定 ID、类型标签。
2. 简短说明。
3. 平台/Minecraft 版本/脚本侧徽章。
4. 签名或调用形式。
5. 参数表和返回值。
6. 最小示例。
7. 成员列表。
8. KubeJS 对照或迁移提示（如果有）。
9. 相关指南、事件和示例链接。
10. 自动生成信息和源 commit。

示例 URL：

```text
/reference/api/bindings/utils/
/reference/api/events/server/server-events/
/reference/api/types/item-stack-js/
/reference/api/members/item-stack-js/with-count/
```

URL 不使用 Java 包全名直接暴露，避免包名变化造成用户可见 URL 大面积变化。页面 frontmatter 中保存 `symbolId`，重命名时由 `redirects.json` 保留旧地址。

### 10.3 `ApiLink` 组件

所有指向 API 符号的链接优先使用：

```mdx
<ApiLink id="binding:Utils" />
```

组件在 build 时解析 symbol index：

- ID 存在，输出稳定 URL 和显示名。
- ID 不存在，构建失败并显示调用文件。
- ID 已迁移，输出新 URL 并给出 warning。
- ID 只有特定平台，显示 availability。

这比手写 `/reference/api/...` 更能防止 API 演进后出现死链。

## 11. 示例策略

示例分三层：

### Level 1：静态检查

所有 TypeScript/JavaScript 示例：

- 使用生成的 `.d.ts`。
- 通过 `tsc --noEmit` 或针对 JavaScript 的 `checkJs`。
- 允许用专门的 `// @ts-expect-error` 表示故意展示的错误。
- 检查 import、全局绑定、事件名和方法参数。

### Level 2：脚本级测试

可以在 NekoJS `test_scripts/` 环境运行、且不依赖世界状态的示例，复制或链接到测试目录：

- 纯工具函数。
- 模块解析。
- 事件处理器形状。
- JSON/Node shim。

### Level 3：游戏运行测试

只对少量关键流程做 NeoForge/Cleanroom headless 测试：

- 配方添加/删除。
- 注册内容。
- reload。
- 关键事件派发。

不要让每次文档文字修改都启动 Minecraft。Level 3 只在 API 快照或相关示例变更时运行，或按 nightly 运行。

示例源文件不要复制到 Markdown code fence；页面通过 import/raw include 引用它们，减少代码漂移。

## 12. 翻译架构

### 12.1 URL 与语言

- 中文为默认语言：`/`。
- 英文为 `/en/`。
- 英文缺页时，导航可显示中文链接并标明 `中文`，不要让用户点击后遇到空白页。
- 代码标识符、文件路径、命令、注册表 ID 不翻译。

### 12.2 翻译元数据

英文页面开头写入：

```yaml
---
title: Modify Recipes
description: Add, remove, and modify recipes with scripts.
type: guide
translationOf: guides/recipes/modify-recipes
sourceRevision: abc1234
translationUpdated: 2026-10-06
---
```

`check-translation-drift.ts` 比较：

- 当前中文页内容 hash/commit。
- 英文页 `sourceRevision`。
- 页面结构、代码块和 API ID。

输出：`UP_TO_DATE`、`STALE`、`MISSING`、`ORPHANED`、`NO_METADATA`。

翻译变更时只要求同步源页实际变化，避免整页重译造成审查噪声。翻译页中的 `TRANSLATION-NOTE` 必须在 PR 中列出，不能长期静默保留。

### 12.3 API 文档翻译

API 自动生成文本以 NekoJS 代码注解的英文为基础。中文翻译存入 overlay，不修改 Java 注解：

- 代码注解保持可被社区和插件作者复用的英文。
- 中文文档可以快速迭代，不必为每个文案变更发布 Mod。
- 缺失中文说明时，显示稳定的英文摘要并带翻译状态。
- 稳定 ID 作为翻译 key，不以页面标题作为 key。

## 13. 版本与平台策略

### 13.1 默认策略：latest + 矩阵

同一页面展示：

```text
NekoJS: 1.1.x
NeoForge: 1.21.1 / 26.1 / 26.2
Cleanroom: 1.12.2
脚本侧: server
```

方法表可以按平台展开；平台差异明显时使用选项卡，但不能把差异隐藏在用户必须点击才能发现的位置。

### 13.2 何时启用完整文档版本

以下情况才创建 `/v1/`、`/v2/`：

- 公开脚本 API 大规模不兼容。
- 迁移旧版的步骤与 latest 完全不同。
- 旧版仍有大量用户且需要长期维护。

不因为每个 Minecraft patch 创建文档版本。小版本差异由 availability 和 changelog 处理。

## 14. 质量门禁

### Pull Request 必跑

1. `pnpm lint`：ESLint、Prettier、Markdown 规则。
2. `pnpm typecheck`：Astro/TypeScript/schema 类型。
3. `pnpm validate:data`：JSON schema、重复 ID、非法 availability。
4. `pnpm generate:api`：清理并重新生成页面。
5. `pnpm check:links`：内部 URL、锚点和 `ApiLink`。
6. `pnpm check:translations`：漂移报告；第一阶段可 warning，长期建议对稳定页阻断。
7. `pnpm check:examples`：静态类型检查。
8. `pnpm build`：完整静态构建和 Pagefind 索引。

### API 快照 PR 额外检查

- added/removed/changed symbol report。
- 受影响页面和示例列表。
- 删除或改名的 symbol 是否有 aliases/redirect。
- availability 是否出现意外扩大或收窄。
- 同一 symbol 的跨平台签名差异是否有解释。

### 内容规则

- 标题层级不跳级。
- 所有页面有 description、type、platforms。
- 代码块声明语言。
- 不在普通段落中硬编码 API URL。
- 不在生成目录手工改文件。
- 中文和英文页面的代码示例保持等价，除注释和展示文本外不随意分叉。

## 15. CI 与发布

### 15.1 主仓库

在 NekoJS 发布流程中：

1. 构建各目标平台。
2. 启动 headless server 或使用已有测试运行时。
3. 执行 JSON Probe backend。
4. 生成各平台 API snapshot 和类型声明。
5. 计算 checksum，上传为 release artifact。
6. 触发 Wiki 仓库的 `repository_dispatch`，或创建自动更新 PR。

第一阶段如果自动启动游戏成本过高，可以手工运行 `/nekojs probe docs json` 生成快照并提交；但文件格式和后续自动流程必须保持一致。

### 15.2 Wiki 仓库

API 更新 PR 自动包含：

- 新旧快照差异。
- 页面生成变更。
- 受影响手写页面。
- 示例检查结果。
- 平台矩阵变化。

人工只审查“事实变化是否正确”和“补充说明是否需要更新”，不审查大批量生成文件。

### 15.3 PR 预览

每个内容 PR 生成预览站点。预览必须使用同一构建命令，不能使用一套简化的开发渲染路径，否则很多链接/schema 问题会到合并后才暴露。

## 16. 部署与可访问性

### 推荐

- 主站：Cloudflare Pages 静态部署。
- 域名：`docs.nekojs.dev` 或项目实际域名。
- 资源：自托管字体或系统字体，避免依赖 Google Fonts。
- 搜索：Pagefind 本地索引，不调用海外搜索服务。
- 反馈：GitHub Issues/Discussions；可在首页放 QQ 群入口，但不把评论系统作为核心功能。

### 中国大陆用户

Cloudflare Pages 和 GitHub Pages 都可能有访问不稳定情况。站点构建产物应完全静态、可由任意 CDN 托管，因此保留这些部署适配：

1. 海外主站。
2. 国内镜像或 CDN；自定义域名是否需要 ICP 备案由部署主体和服务商确认。
3. release 中提供离线 HTML/Markdown/API JSON 包。

不要在正文中直接依赖外部 iframe、远程字体或外部 JavaScript CDN。

## 17. 可扩展性

### 第三方扩展

第三方扩展（如 Files-NJS、NekoJS CSV）可以提交自己的快照：

```text
source: files-njs
sourceVersion: 0.3.0
schemaVersion: 1
```

Wiki 默认只收录经过审核的 source。扩展作者可以：

- 在自己的仓库构建相同 schema 的 JSON。
- 提供 release artifact URL。
- 提供英文/中文 overlay。
- 通过 PR 加入 `data/api/sources.json`。

扩展数据必须有命名空间，不能覆盖 `nekojs` 的符号。

### 新语言

API snapshot 本身与 TypeScript/Python 无关；新增语言只需：

- NekoJS 中新增一个 Probe backend 或类型产物。
- Wiki 的 code example checker 增加适配器。
- 页面组件继续使用语言无关的 symbol 数据。

### 新平台

新增平台只需：

- 在平台清单中加入稳定 ID。
- 提供一份快照。
- 补充差异 overlay 或 availability。
- 如 URL 不变，不需要复制文档页。

## 18. 迁移现有 Wiki

按阶段迁移，不要一次性重写：

### 阶段 A：导入与保真

- 把现有 `wiki/*.md` 复制到新目录。
- 保留正文、代码和历史链接。
- 运行脚本将 GitHub Wiki 链接转换为站点相对链接。
- 为每页补 `title`、`description`、`type`、`platforms`。
- 用原 `_Sidebar.md` 生成初始导航。

### 阶段 B：结构整理

- 把页面按 getting-started/guides/concepts/reference/plugin-dev/contributing 归类。
- 长页拆成多个可搜索页面。
- 把 API 事实从手写页迁移到 Probe 快照。
- 手写页只保留解释、流程、边界和示例。

### 阶段 C：自动化

- 接入 JSON Probe backend。
- 生成第一批 binding/event/API 页面。
- 建立 overlay 和 symbol link。
- 开启 API link、schema、示例和翻译检查。

### 阶段 D：发布

- 配置 PR preview。
- 配置 latest 部署。
- 将旧 GitHub Wiki 首页改为迁移说明和新站点链接。
- 保留旧页面一段时间，通过 redirects 处理旧 URL。

## 19. 实施路线图

### Milestone 0：决策与骨架

- 建立独立 Docs 仓库或主仓库 `docs-site/`。
- 初始化 Astro + Starlight + TypeScript。
- 建立中文默认语言和英文 `/en/`。
- 加入 content schema、页面模板和基础 CI。

### Milestone 1：迁移可读内容

- 迁移首页、快速开始、脚本基础、目录结构、FAQ。
- 提供 `pnpm new:page --type guide`。
- 完成旧链接转换、导航和预览部署。

### Milestone 2：API 数据管道

- 在 NekoJS 中实现 JSON Probe backend。
- 固化 schema、symbol ID 和平台 ID。
- 手工生成四个平台快照并提交。
- 生成 bindings/events/types 页面。

### Milestone 3：质量与翻译

- 接入 API link checker、示例 `tsc` 检查、translation drift。
- 为高频 API 建立中文 overlay。
- 迁移现有英文页面并建立英文侧导航。

### Milestone 4：发布自动化

- NekoJS release 自动上传快照。
- Wiki 自动创建 API 更新 PR。
- 加入快照 diff、变更影响报告和 nightly headless 检查。

### Milestone 5：生态与版本

- 接入第三方 addon source。
- 增加 Cookbook 标签和过滤。
- 只有出现真正 breaking release 时再启用版本化文档。

## 20. 需要尽早确认的决策

这些不应阻塞第一版，但应在开始实施前定下来：

1. Wiki 是否和 NekoJS 主仓库同仓库，还是独立 `NekoJS-Docs`。
2. 站点正式域名和中国大陆镜像是否由同一组织维护。
3. 首批支持的稳定平台 ID：建议 `neoforge-1.21.1`、`neoforge-26.1`、`neoforge-26.2`、`cleanroom-1.12.2`。
4. 首批 API 页面范围：建议仅 NekoJS 自有脚本表面，不生成完整 Minecraft 类树。
5. 翻译质量门禁是否在第一阶段只报告 warning，还是稳定页直接阻断。
6. 是否接受社区扩展提交 API snapshot，及其审核和版本兼容规则。

## 21. 参考资料

- [NekoJS 主仓库](https://github.com/NekoJS-Dev/NekoJS)
- [NekoJS 现有 Probe 类型生成文档](https://github.com/NekoJS-Dev/NekoJS/blob/master/wiki/Probe-%E7%B1%BB%E5%9E%8B%E7%94%9F%E6%88%90.md)
- [NekoJS 现有翻译流程](https://github.com/NekoJS-Dev/NekoJS/blob/master/docs/translation-workflow.md)
- [Starlight 插件与集成](https://starlight.astro.build/zh-cn/resources/plugins/)
- [Pagefind 多语言搜索](https://pagefind.app/docs/multilingual/)
- [Lunaria](https://lunaria.dev/)

以上链接用于说明选型依据；版本号、插件兼容性和部署限制应在真正初始化项目时重新核对。
