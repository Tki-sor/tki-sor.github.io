---
title: Documentation Architecture
description: How NekoJS Wiki content, API snapshots, and generated pages work together.
type: contributing
status: preview
platforms: [all]
sides: [all]
keywords: [documentation, API snapshot, overlay, Starlight]
translationOf: contributing/docs-architecture
sourceRevision: initial
translationUpdated: 2026-10-06
---

# Documentation Architecture

The Wiki has three layers:

- **Handwritten pages**: tutorials, guides, and concepts in `src/content/docs/`.
- **API snapshots**: runtime Probe output in `data/api/`.
- **Overlays**: localized titles, notes, and examples in `data/overlays/`.

The build validates snapshots before generating `reference/api/generated/`. Do not edit generated files directly. Change runtime facts in NekoJS Probe output and change explanations in overlays.
