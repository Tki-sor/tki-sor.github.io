# ADR 0001：采用 Astro Starlight 与 API 快照驱动的文档站

- 状态：Accepted
- 日期：2026-10-06
- 决策范围：NekoJS 文档站的站点框架、内容源和 API 参考生成方式

## 背景

NekoJS 已经有一批中文 GitHub Wiki 页面，并且运行时已经存在 catalog、Probe、TypeScript 声明生成和翻译漂移检查等基础能力。新的文档站需要同时支持：

- 中文优先和英文翻译。
- 多平台 API 可用性矩阵。
- 自动生成的绑定、事件和类型参考。
- 手写教程与生成参考的分离。
- 稳定的页面链接、搜索、PR 预览和静态部署。
- 未来接入第三方 NekoJS 扩展。

如果继续把 API、教程和翻译全部写在 GitHub Wiki Markdown 中，运行时 API 变化后很容易出现内容漂移；如果让网站直接反射 Java，则会把 Minecraft 运行时耦合到网站构建，难以测试和部署。

## 决策

采用以下组合：

1. 使用 Astro + Starlight 作为文档站实现。
2. 使用 Markdown 作为默认内容格式，MDX 只用于 `ApiLink`、平台徽章、代码选项卡等少量组件。
3. 使用 TypeScript 编写生成器、schema 校验、翻译检查和 CI 工具。
4. 在 NekoJS 主仓库中增加 JSON Probe backend，消费已有 catalog snapshot 和 Probe IR。
5. Wiki 仓库存储版本化 API JSON 快照和人工 overlay；网站构建前生成 API Markdown/MDX 页面。
6. 生成页加入忽略列表，手写页和 overlay 才是可直接编辑的内容源。
7. 使用 Pagefind 做构建时搜索，中文站点设置正确的 `lang` 属性。
8. 默认使用 latest 文档和平台矩阵；只有发生真正的公开 API breaking release 时再启用完整文档版本。

## 结果

### 正面结果

- 运行时 API、IDE 声明和网站参考可以共享 Probe 的公开名、隐藏规则和文档元数据。
- 生成器只需消费稳定 JSON，不需要启动 Minecraft，也不需要理解 Java 反射。
- 文档作者仍然只需编辑 Markdown 和简单的 overlay 文件。
- API 变化可以产生结构化 diff，并在构建期发现失效链接和示例。
- 静态产物可以部署到 Cloudflare Pages、国内 CDN 或离线包，避免锁定某一个托管平台。
- 平台差异使用 availability 表达，避免为每个 Minecraft 版本复制整棵文档树。

### 代价

- 需要维护 NekoJS 主仓库和 Wiki 仓库之间的快照同步。
- 需要定义并长期兼容 API snapshot schema 和 symbol ID。
- 生成页问题通常要回到快照、overlay 或生成器排查，不能直接在网页文件上临时修补。
- Astro/Starlight 的生态与插件版本需要锁定并定期升级。
- 中文搜索质量必须用真实页面和查询验证，不能只依赖工具默认配置。

## 备选方案

### VitePress

VitePress 对中文开发者友好，Vue 生态和自定义主题能力强，也适合纯 Markdown 文档。它是可接受的备选方案。

未选择它作为首选的原因是：内容集合 schema、生成数据与国际化 fallback 需要较多自定义约定；本项目更希望把“内容契约”作为一个清晰模块，而不是分散在主题和构建脚本中。

若团队更熟悉 Vue，或希望最大限度复用现有 Vue 组件，VitePress 可以替代 Starlight，API snapshot 和 overlay 契约不应改变。

### Docusaurus

Docusaurus 的版本化和国际化成熟，适合拥有多个稳定大版本的项目。但 React 运行时和配置复杂度对当前规模偏重，且本项目暂时不需要每个 Minecraft 小版本都生成独立文档。

### GitHub Wiki

适合快速开始，不适合作为长期系统。它保留作为旧内容来源和迁移过渡，不作为最终发布层。

### API 页面完全手写

实现简单，但无法可靠反映多平台运行时差异，且会重复维护 Java/Probe/网站三份事实。拒绝。

### 网站构建时直接运行 Minecraft

可以获得最新运行时数据，但会令普通内容构建依赖 Minecraft、Java、加载器和图形/服务器环境。拒绝作为每次 build 的路径；保留给 release/nightly 快照生产。

## 约束

- schema 和 symbol ID 属于公共契约，变更必须有迁移策略。
- 任何 overlay 都必须能解析到现有 symbol ID。
- 生成页不接受直接手工修改。
- 站点生成必须可在没有 Minecraft 进程的环境中完成。
- 第一阶段只自动生成 NekoJS 自有脚本表面，不生成完整 Minecraft 类型百科。

## 后续验证

实施第一个 vertical slice 时验证：

1. 一个 binding 快照能否生成页面、平台徽章和 `ApiLink`。
2. 同一 binding 在 NeoForge 和 Cleanroom 的签名差异能否被报告。
3. 中文 Pagefind 查询能否找到绑定名、中文标题和代码标识符。
4. 删除一个 symbol 后，CI 能否列出受影响的 overlay、页面和示例。
5. 英文页的 `sourceRevision` 是否能准确判断中文页变化。
