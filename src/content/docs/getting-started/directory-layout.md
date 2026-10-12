---
title: 目录结构
description: 了解 NekoJS 脚本目录、类型声明和资源目录。
type: guide
status: preview
platforms: [all]
sides: [all]
keywords: [目录结构, startup_scripts, server_scripts, client_scripts]
---

# 目录结构

安装并首次启动后，游戏目录会生成 `nekojs/`：

```text
nekojs/
├── startup_scripts/  # 注册物品、方块等启动期内容
├── server_scripts/   # 配方、事件和服务端逻辑
├── client_scripts/   # 客户端渲染、按键和视觉逻辑
├── test_scripts/     # 通过 /nekojs test 显式运行
├── node_modules/     # 纯 JavaScript 依赖
├── assets/           # 资源文件
└── data/             # 数据包文件
```

每个脚本目录都有自己的编辑器配置。运行 `/nekojs probe` 会更新 `.neko_probe/` 中的声明文件，并合并 `jsconfig.json`。
