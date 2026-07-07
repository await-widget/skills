---
name: await-widget
description: Build and debug widgets for Await. Use this skill when setting up an Await workspace, building Await widgets, running Await type checks, syncing or debugging via the Await CLI, or seeking guidance on widget development.
---

## Routing

Treat this skill as a routing layer rather than a complete reference.

Combine it with the user's installed `@await-widget/runtime` declarations and the task-specific docs in `docs-source/`. See `docs-source/index.md` for the guides directory, then read only the guide needed for the current task.

For visual widget work, read both `guides/design.md` and `guides/resources.md` before implementing. Use the design guide to choose between basic shapes and media assets. When the chosen motif depends on texture, photography, illustration, or material detail, follow the resources guide to inspect local assets and actively download or generate a suitable asset when one is missing.

## Overview

Await widgets are written in TSX syntax with SwiftUI-style naming, but they are not React, DOM, or SwiftUI. The syntax and naming are borrowed, but the API contract is defined entirely by `@await-widget/runtime` types.

Await provides two callback functions to iOS: `widgetTimeline()` returns dated entries, and `widget(entry)` returns the view for the entry specified by iOS. iOS decides when to call these functions and may reject overly frequent timeline refresh requests for battery efficiency.

```text
[1] iOS decides when to update the widget
     │
     ▼ calls
[2] widgetTimeline()
     │
     ▼ returns Entry[]
[3] { entry@09:00, entry@09:01, entry@09:02, ... }
     │
     ▼ iOS specifies entry@09:01, calls
[4] widget(entry)
     │
     ▼ returns the widget view
```

## Core Rules

* All available APIs and types are defined in `node_modules/@await-widget/runtime/types/*.d.ts`. Treat these files as the source of truth. Do not use any APIs or features outside these declarations, including the HTML DOM, browser and Node APIs (including `fetch`), CSS, or React-style hooks and state.
* TSX components are imported from the `await` module (e.g. `import {Text, ZStack} from 'await';`). Component, prop, modifier definitions live in `node_modules/@await-widget/runtime/types/await.d.ts`.
* Bridge APIs are host-provided globals (`Await`, `AwaitStore`, `AwaitNetwork`, `AwaitMusic`, etc.). Use them directly; do not import them. Their signatures live in `node_modules/@await-widget/runtime/types/bridge.d.ts`.
* Component attributes are either init attributes or modifiers. Modifiers can be repeated on the same component, and their order matters—just like SwiftUI modifiers. When a TSX element needs the same modifier more than once, append a unique suffix (for example `frame_` or `frame_1`) to the attribute name to avoid TSX syntax errors.
* Keep widget view trees minimal: no extra views, nesting, or timeline entries beyond what is needed. iOS widgets run under tight memory limits. Widget cost is roughly proportional to `timeline entries * view tree node count`, so prefer a single timeline entry unless the widget must display visibly different states over time.
