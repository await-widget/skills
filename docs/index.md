# Await Widget Developer Docs

Await widgets are iOS widget experiences written in TSX with a SwiftUI-style component DSL. They run in the Await App host, use components from `await`, and rely on `@await-widget/runtime` for public TypeScript declarations.

These docs are AI-first. They are written for TypeScript developers and for people who describe what they want while an AI agent writes the widget code.

## The Await Widget Ecosystem

- Await App runs widgets on iOS and provides native capabilities.
- `library` builds gallery/widget files that the app can download.
- `skills` provides the installable `await-widget` agent skill and hosts this docs site.
- `runtime` publishes `@await-widget/runtime`, the public type declaration package for widget type checking.
- `docs` explains workflows, prompting, and generated API reference for humans and agents.

## Ask An AI To Use These Docs

Use this prompt when starting a widget task:

```text
Use the await-widget skill.
Read await-widget/SKILL.md first.
Then read docs/index.md and the guide or reference pages relevant to my request.
Use only APIs declared in @await-widget/runtime or documented under docs/reference.
Do not use HTML tags, CSS, React hooks, React state, fetch, or browser APIs.
```

## Reading Paths

For "I describe, AI codes" users:

1. Start with [Create A Widget](guides/create-a-widget.md).
2. Read [Panels](guides/panels.md) if you want editable settings.
3. Read [Bridge APIs](guides/bridge-apis.md) if the widget needs store, network, files, weather, calendar, reminders, health, media, audio, or location.
4. Use the [Prompt Cookbook](prompts/cookbook.md) to brief your AI agent.

For TypeScript developers:

1. Read [Runtime Model](guides/runtime-model.md).
2. Read [Timeline](guides/timeline.md) and [Intents](guides/intents.md).
3. Use the generated [Reference](reference/index.md) for exact declarations.
4. Check `library/gallery/*/index.tsx` for complete examples.

## Core Rules

- Import components only from `await`.
- Register widgets with `Await.define({...})`.
- Do not write HTML tags, CSS, React hooks, React state, browser `fetch`, or DOM code.
- Use props and modifiers for layout and styling.
- Treat `runtime/types/*.d.ts` and the generated reference as the public API source of truth.
- Keep widget view trees and timelines small unless the visible result needs more complexity.

## Guides

- [Runtime Model](guides/runtime-model.md)
- [Create A Widget](guides/create-a-widget.md)
- [Modify A Widget](guides/modify-a-widget.md)
- [Panels](guides/panels.md)
- [Timeline](guides/timeline.md)
- [Intents](guides/intents.md)
- [Bridge APIs](guides/bridge-apis.md)

## Reference

- [Reference Overview](reference/index.md)
- [Await](reference/await.md)
- [Bridge](reference/bridge.md)
- [JSX](reference/jsx.md)
- [Meta](reference/meta.md)
- [Model](reference/model.md)
- [Prop](reference/prop.md)

## Prompting

- [Prompt Cookbook](prompts/cookbook.md)
