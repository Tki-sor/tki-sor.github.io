---
title: 文档架构
description: 了解 NekoJS Wiki 的内容、API 快照和生成页面如何协作。
type: contributing
status: preview
platforms: [all]
sides: [all]
keywords: [文档, API 快照, overlay, Starlight]
---

# 文档架构

Wiki 把内容分成三层：

- **手写页面**：教程、指南和概念解释，放在 `src/content/docs/`。
- **API 快照**：由 NekoJS 运行时 Probe 生成，放在 `data/api/`。
- **覆盖说明**：为 API 补充本地化标题、注意事项和示例，放在 `data/overlays/`。

构建时会先校验快照，再生成 `reference/api/generated/`。这个目录不应直接编辑；要改 API 事实，请修改 NekoJS 的 Probe 输出，要改说明，请修改 overlay。

<ApiLink id="binding:Utils" />
