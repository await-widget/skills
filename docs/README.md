# Await Widget Developer Docs

Await widgets are small iOS widget experiences written in TSX with a SwiftUI-style component DSL. They run in the Await host, not in a browser, so code uses components from `await`, global Await bridge APIs, and TypeScript declarations from `@await-widget/runtime`.

This documentation is AI-first: it is meant to be read by coding agents as well as by people. If you are using AI to create or modify a widget, tell the AI to read this directory before writing code.

## Ask An AI To Use These Docs

Use this prompt when starting a widget task:

```text
Read skills/await-widget/SKILL.md and skills/docs/README.md first.
Then read the guide or reference pages relevant to my request.
Use only APIs declared in @await-widget/runtime or documented under skills/docs/reference.
Do not use HTML tags, CSS, React hooks, React state, fetch, or browser APIs.
```

## Reading Paths

For AI-assisted non-coders:

1. Read [Create A Widget](guides/create-a-widget.md).
2. Read [Panels](guides/panels.md) if you want editable settings.
3. Read [Bridge APIs](guides/bridge-apis.md) if the widget needs data from store, network, files, weather, calendar, reminders, health, media, audio, or location.
4. Use the [Prompt Cookbook](prompts/cookbook.md).

For TypeScript developers:

1. Read [Runtime Model](guides/runtime-model.md).
2. Read [Timeline](guides/timeline.md) and [Intents](guides/intents.md).
3. Use the generated reference pages under [Reference](reference/index.md).
4. Check `library/gallery/*/index.tsx` for complete examples.

## Core Rules

- Import components only from `await`.
- Register widgets with `Await.define({...})`.
- Native HTML elements are invalid. Do not write `<div>`, `<span>`, or browser DOM code.
- Use props and modifiers for layout and styling. Do not use CSS or `style` objects.
- Use `AwaitNetwork.request(...)` instead of `fetch`.
- Treat `runtime/types/*.d.ts` as the source of truth.
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
- [Components](reference/components.md)
- [Props And Modifiers](reference/props-and-modifiers.md)
- [Bridge APIs](reference/bridge-apis.md)
- [Global Types](reference/global-types.md)
- [JSX Runtime](reference/jsx-runtime.md)

## Examples

Use `library/gallery/*/index.tsx` as larger examples. Useful starting points:

- `library/gallery/Panels/index.tsx` for panels, timeline, store, and intents.
- `library/gallery/Weather/index.tsx` for weather data.
- `library/gallery/Calendar/index.tsx` for calendar data.
- `library/gallery/Reminder/index.tsx` for reminders.
- `library/gallery/Music/index.tsx` for media data.
- `library/gallery/Location/index.tsx` for location data.
