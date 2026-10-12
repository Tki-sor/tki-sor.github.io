---
title: Modify Recipes
description: Add, remove, and modify recipes with NekoJS scripts.
type: guide
status: preview
platforms: [neoforge-26.1]
sides: [server]
keywords: [recipe, server_scripts]
translationOf: guides/recipes/modify-recipes
sourceRevision: initial
translationUpdated: 2026-10-06
---

# Modify Recipes

Put recipe logic in `nekojs/server_scripts/`. A minimal script registers a recipe event and operates on the recipe collection exposed by the callback.

```ts
ServerEvents.recipes(event => {
  event.remove({ output: 'minecraft:stick' });
  event.shaped('minecraft:diamond', ['SSS', 'S S', 'SSS'], {
    S: 'minecraft:stone'
  });
});
```

After changing the script, run `/nekojs reload server`.

Recipe scripts should be idempotent: each reload should produce the same result from the same input.
