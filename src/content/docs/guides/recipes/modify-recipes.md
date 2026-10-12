---
title: 修改配方
description: 使用 NekoJS 脚本添加、删除和修改配方。
type: guide
status: preview
platforms: [neoforge-26.1]
sides: [server]
keywords: [配方, recipe, server_scripts]
---

# 修改配方

把配方逻辑放在 `nekojs/server_scripts/` 中。一个最小的脚本通常只需要注册配方事件，然后在回调中操作事件提供的配方集合。

```ts
ServerEvents.recipes(event => {
  event.remove({ output: 'minecraft:stick' });

  event.shaped('minecraft:diamond', [
    'SSS',
    'S S',
    'SSS'
  ], {
    S: 'minecraft:stone'
  });
});
```

修改脚本后运行：

```text
/nekojs reload server
```

配方脚本应当是幂等的：每次 reload 都从相同输入得到相同结果，不要依赖上一次执行留下的临时状态。

## 下一步

- 查看 [目录结构](/getting-started/directory-layout/)。
- 查看 [API 参考](/reference/api/)。
- 使用 `/nekojs probe` 更新编辑器类型声明。
