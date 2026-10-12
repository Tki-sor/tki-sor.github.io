---
title: 第一个脚本
description: 创建并运行你的第一个 NekoJS 服务端脚本。
type: tutorial
status: preview
platforms: [all]
sides: [server]
keywords: [第一个脚本, server_scripts, 快速开始]
---

# 第一个脚本

创建 `nekojs/server_scripts/hello.ts`：

```ts
ServerEvents.tick(event => {
  if (event.server.ticks % 200 === 0) {
    event.server.tell('NekoJS is running.');
  }
});
```

首次使用时运行 `/nekojs probe` 生成编辑器声明。修改服务端脚本后，可以使用 `/nekojs reload server` 重新加载。

<ApiLink id="binding:Utils" />
