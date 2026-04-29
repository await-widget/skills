---
name: await-widget
description: Create or modify Await widgets in TSX using the custom SwiftUI-style DSL, native bridge APIs, modifiers, timelines, intents, and @panel controls. Use when the user asks to build, edit, or scaffold an Await widget.
license: MIT
version: "1.0.0"
last_updated: "2026-04-27"
user_invocable: true
---

# Await Widget

This package is both an installable agent skill and a cloneable widget template. Treat the `@await-widget/runtime` declarations as the public contract.

`examples/` is the template project root.

## Workflow

1. Locate the target widget.
   - If the user gives a file, edit that file.
   - If the user is working in a fresh clone of this repo, edit the `index.tsx` inside the desired template directory under `examples/`.
   - If the user asks for a new widget project, copy `examples/package.json`, `examples/tsconfig.json`, and the desired template directory under `examples/` into the target project before editing.
2. Ensure dependencies are available, running `npm install` in the widget project if `node_modules/@await-widget/runtime` is missing. Then read only the `@await-widget/runtime` declarations needed for the task:
   - `node_modules/@await-widget/runtime/types/await.d.ts`: importable components and JSX entry.
   - `node_modules/@await-widget/runtime/types/bridge.d.ts`: global native bridge APIs and `Await.define` types.
   - `node_modules/@await-widget/runtime/types/prop.d.ts`: component props and modifier types.
   - `node_modules/@await-widget/runtime/types/global.d.ts`: global types.
   - `node_modules/@await-widget/runtime/types/jsx.d.ts`: JSX constraints.
3. Implement the widget.
4. Run `npm test` in the widget project directory or `examples/` for a fresh clone. If dependencies are missing, run `npm install` first.

## Basic Rules

- Import components only from `await`.
- Do not write native HTML tags. `JSX.IntrinsicElements` is `never`, so `<div>` and `<span>` are invalid.
- Register widgets with `Await.define({...})`.
- Express view styling through props and modifiers. Do not use CSS, `style` objects, React hooks, or React state.
- If a component, prop, modifier, or native bridge API is not in the `@await-widget/runtime` declarations, treat it as unavailable.
- Widgets run inside a widget environment, not a full app page. Keep the view tree and timeline small by default.
- Design permission-related behavior as "already authorized by the host" or "currently unavailable". Do not put first-run authorization flows inside the widget.
- When generating a widget, also generate a small `@panel` surface by default for the main tunable values unless the user explicitly says not to.
- Modifier order is semantic. Later modifiers wrap earlier modifiers, so `<ZStack background='fff' padding={8}>` creates transparent padding outside the background.
- For label, tag, or capsule-like blocks, write `padding` before `background` when the background should include the padding area.
- Check every node that combines `background` and `padding`; do not assume HTML or CSS ordering rules.
- `id` is a stable identity field. `undefined` children are dropped, and `Fragment` only flattens children.

## Layout Notes

- Use `maxSides` on the root view when it must fill the whole widget.
- Use `minimumScaleFactor` when text needs to adapt across widget sizes.
- Visible rounded containers should stay concentric with the widget corner shape. Reduce inner corner radius by the actual inset from the outer rounded container.

## Panel Comments

- `@panel` is a source comment convention. Put it immediately above the declaration it controls.
- Value panels only work on top-level `const` declarations, including exported top-level `const` declarations.
- For value panels, the initializer must be a literal the panel can rewrite directly: string, number, boolean, or a color(string/number) literal used with `type:'color'`.
- Do not put `@panel` on `let`, `var`, local variables inside functions, computed initializers, or private implementation details you do not want edited from the panel.
- If you provide a payload, it must be a JS object literal after `@panel`.

Supported panel types:

- `// @panel` for string, number, boolean
- `// @panel {type:'slider',min:number,max:number,step?:number}` for number
- `// @panel {type:'menu',items:[...]}` for string, number
- `// @panel {type:'color'}` for string, number
- `// @panel {type:'password'}` for string

## Minimal Template

```tsx
import {
	Text,
	ZStack,
} from 'await';

function widget() {
	return (
		<ZStack>
			<Text value='Hello, World!'/>
		</ZStack>
	);
}

Await.define({
	widget,
});
```

## Timeline

- `widgetTimeline(context)` is optional.
- It returns `{entries, update?}`, where `update` can be a `Date`, `"end"`, or `"never"`.
- `entries` is an array containing `date` plus optional entry data.
- If the widget does not need time-driven updates, omit `widgetTimeline`.
- Prefer a single entry unless the widget needs continuous time-based changes.
- More entries increase rendering cost. Avoid entries that do not change user-visible output.
- For continuous changes, cover at least about `15m04s + buffer` of timeline entries.
- If the goal is to refresh as fast as the system allows, use `update: new Date()`. Do not hardcode minute intervals below the practical system limit(15 minutes 4 seconds ~ 15 minutes 10 seconds).

## Intents

- Register interaction functions under `widgetIntents`.
- Generate `intent` values from the result of `Await.define(...)`.
- Parameters must be encodable values.

## Animations And Interaction

- If you need continuous movement or interaction transitions, give visual entities stable `id` values.
- Widget animation duration is capped at 2 seconds, even though iPhone animations are not internally limited the same way.
- For moving entities, prefer a stable outer shell with `id` and `offset`, with inner content handling insertion or removal `transition`.
- Do not put `offset` and `transition='scale'` on the same node.

```tsx
import {Button, Text} from 'await';

function tap(step: number) {
	const count = AwaitStore.num('count', 0);
	AwaitStore.set('count', count + step);
}

function widget() {
	return (
		<Button intent={app.tap(1)}>
			<Text value='Add'/>
		</Button>
	);
}

const app = Await.define({
	widget,
	widgetIntents: {tap},
});
```

## Complexity

- Widget complexity is roughly `entries.length * viewTreeNodeCount`.
- Avoid timeline entries or view nodes that do not create user-visible value.

## Data And Capabilities

- Use AwaitStore to manage persistent state. Widget state should typically come from persistent data or timeline entries. AwaitStore is fast and efficient for normal state reads and writes, making it ideal for storing widget state when necessary.
- Use AwaitNetwork.request(...) for all networking needs, avoiding fetch.
- Use AwaitFile for file access, but remember it can only interact with files located within the widget directory. Do not access hidden or parent paths.
- Use AwaitEnv for retrieving the widget's id, tag, or host. The tag allows a single widget to have multiple versions, with each version maintaining its own database and audio state.

## Decision Order

1. Check `node_modules/@await-widget/runtime/types/await.d.ts` to see whether the component exists.
2. Check `node_modules/@await-widget/runtime/types/prop.d.ts` to see whether the prop or modifier is valid.
3. Check `node_modules/@await-widget/runtime/types/bridge.d.ts` to see whether the native bridge API exists.
4. If it is not in the `@await-widget/runtime` declarations, treat it as unavailable.
