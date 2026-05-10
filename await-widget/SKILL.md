---
name: await-widget
description: Create or modify Await widgets in TSX using the custom SwiftUI-style DSL, native bridge APIs, modifiers, timelines, intents, and @panel controls. Use when the user asks to build, edit, or scaffold an Await widget.
license: MIT
version: "1.0.0"
last_updated: "2026-05-10"
user_invocable: true
---

# Await Widget

This is the compact execution rulebook for agents. Treat `@await-widget/runtime` declarations as the public API contract.

For deeper guides, generated API reference, and prompt patterns, read `../docs/README.md`.

## Workflow

1. Locate the target widget file.
   - If the user gives a file, edit that file.
   - If the user is working from this skill repo, edit the relevant `examples/*/index.tsx`.
   - If the user asks for a new widget project, copy `examples/package.json`, `examples/tsconfig.json`, and the desired example directory before editing.
2. Ensure dependencies exist. Run `npm install` in the widget project only if `node_modules/@await-widget/runtime` is missing.
3. Read only the runtime declarations needed for the task:
   - `node_modules/@await-widget/runtime/types/await.d.ts`: importable components and `await` module surface.
   - `node_modules/@await-widget/runtime/types/bridge.d.ts`: global bridge APIs and `Await.define`.
   - `node_modules/@await-widget/runtime/types/model.d.ts`: shared runtime data models.
   - `node_modules/@await-widget/runtime/types/meta.d.ts`: primitive style, layout, drawing, and value types.
   - `node_modules/@await-widget/runtime/types/prop.d.ts`: component props and modifiers.
   - `node_modules/@await-widget/runtime/types/jsx.d.ts`: JSX constraints.
4. Implement the widget.
5. Run `npm test` in the widget project or in `examples/`.

## Hard Rules

- Import components only from `await`.
- Register widgets with `Await.define({...})`.
- Do not write HTML tags, CSS, `style` objects, React hooks, React state, browser DOM code, or browser `fetch`.
- Use `AwaitNetwork.request(...)` for networking.
- If a component, prop, modifier, or bridge API is not declared in `@await-widget/runtime`, treat it as unavailable.
- Widgets run in a widget environment. Keep view trees and timelines small unless visible behavior needs more complexity.
- Design permission-related behavior as "already authorized by the host" or "currently unavailable". Do not put first-run authorization flows inside the widget.
- Modifier order is semantic. Later modifiers wrap earlier modifiers; for label-like blocks, put `padding` before `background` when the background should include the padded area.

## Widget Patterns

- Use `maxSides` on the root view when it must fill the widget.
- Use `minimumScaleFactor` when text needs to adapt across widget sizes.
- Give animated or changing visual entities stable `id` values.
- `undefined` children are dropped, and `Fragment` only flattens children.

## Panels

- `@panel` is a source comment convention. Put it immediately above the top-level `const` it controls.
- Value panels require literal initializers: string, number, boolean, or a color string/number literal with `type:'color'`.
- Do not put `@panel` on `let`, `var`, local variables, computed initializers, or private implementation details.
- When generating a widget, add a small `@panel` surface for the main tunable values unless the user says not to.

Supported panel comments:

- `// @panel`
- `// @panel {type:'slider',min:number,max:number,step?:number}`
- `// @panel {type:'menu',items:[...]}`
- `// @panel {type:'color'}`
- `// @panel {type:'password'}`

## Timeline And Intents

- `widgetTimeline(context)` is optional. Use it only for time-driven data.
- Return `{entries, update?}`. `update` can be a `Date`, `"end"`, `"rapid"`, or `"never"`.
- Prefer a single timeline entry unless multiple entries create visible value.
- Register interaction functions under `widgetIntents`, and pass encodable arguments only.
- Generate `intent` values from the result returned by `Await.define(...)`.

## Data And Capabilities

- Use `AwaitStore` for persistent widget state.
- Use `AwaitFile` only for files within the widget directory.
- Use bridge APIs such as weather, calendar, reminder, health, media, audio, and location only when declared in `node_modules/@await-widget/runtime/types/bridge.d.ts`.

## Decision Order

1. Check `node_modules/@await-widget/runtime/types/await.d.ts` for components.
2. Check `node_modules/@await-widget/runtime/types/prop.d.ts` for props and modifiers.
3. Check `node_modules/@await-widget/runtime/types/bridge.d.ts` for bridge APIs.
4. Check `node_modules/@await-widget/runtime/types/model.d.ts` and `node_modules/@await-widget/runtime/types/meta.d.ts` for shared type details.
5. If it is not in the runtime declarations, treat it as unavailable.
