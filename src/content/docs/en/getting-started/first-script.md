---
title: First Script
description: Create and run your first NekoJS server script.
type: tutorial
status: preview
platforms: [all]
sides: [server]
keywords: [first script, server_scripts, quick start]
translationOf: getting-started/first-script
sourceRevision: initial
translationUpdated: 2026-10-06
---

# First Script

Create `nekojs/server_scripts/hello.ts`:

```ts
ServerEvents.tick(event => {
  if (event.server.ticks % 200 === 0) {
    event.server.tell('NekoJS is running.');
  }
});
```

Run `/nekojs probe` once to generate editor declarations, then use `/nekojs reload server` after changing server scripts.
