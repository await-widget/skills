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

`assets/` is the template project root.

## Workflow

1. Locate the target widget.
   - If the user gives a file, edit that file.
   - If the user is working in a fresh clone of this repo, edit the `index.tsx` inside the desired template directory under `assets/`.
   - If the user asks for a new widget project, copy `assets/package.json`, `assets/tsconfig.json`, and the desired template directory under `assets/` into the target project before editing.
2. Ensure dependencies are available, running `npm install` in the widget project if `node_modules/@await-widget/runtime` is missing. Then read only the `@await-widget/runtime` declarations needed for the task:
   - `node_modules/@await-widget/runtime/runtime/await.d.ts`: importable components and JSX entry.
   - `node_modules/@await-widget/runtime/runtime/bridge.d.ts`: global native bridge APIs and `Await.define` types.
   - `node_modules/@await-widget/runtime/types/prop.d.ts`: component props and modifier types.
   - `node_modules/@await-widget/runtime/types/global.d.ts`: global types.
   - `node_modules/@await-widget/runtime/types/jsx.d.ts`: JSX constraints.
3. Implement the widget.
4. Run `npm test` in the widget project directory or `assets/` for a fresh clone. If dependencies are missing, run `npm install` first.

## Basic Rules

- Import components only from `await`.
- Do not write native HTML tags. `JSX.IntrinsicElements` is `never`, so `<div>` and `<span>` are invalid.
- Register widgets with `Await.define({...})`.
- Express view styling through props and modifiers. Do not use CSS, `style` objects, React hooks, or React state.
- If a component, prop, modifier, or native bridge API is not in the `@await-widget/runtime` declarations, treat it as unavailable.
- Widgets run inside a widget environment, not a full app page. Keep the view tree and timeline small by default.
- Design permission-related behavior as "already authorized by the host" or "currently unavailable". Do not put first-run authorization flows inside the widget.
- When generating a widget, also generate a small `@panel` surface by default for the main tunable values unless the user explicitly says not to.

## Panel Comments

- `@panel` is a source comment convention. Put it immediately above the declaration it controls.
- Value panels only work on top-level `const` declarations, including exported top-level `const` declarations.
- Function panels work on function declarations and top-level function-valued declarations.
- For value panels, the initializer must be a literal the panel can rewrite directly: string, number, boolean, or a color(string/number) literal used with `type:'color'`.
- Do not put `@panel` on `let`, `var`, local variables inside functions, computed initializers, or private implementation details you do not want edited from the panel.
- If you provide a payload, it must be a JS object literal after `@panel`.

Supported panel types:

- `// @panel`
- `// @panel {type:'slider',min:number,max:number,step?:number}`
- `// @panel {type:'menu',items:[...]}`
- `// @panel {type:'color'}`

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
- It returns `{entries, update?}`.
- `entries` is an array containing `date`.
- If the widget does not need time-driven updates, omit `widgetTimeline`.
- If the goal is to refresh as fast as the system allows, use `update: new Date()`. Do not hardcode minute intervals below the practical system limit.

## Intents And Interaction

- Register interaction functions under `widgetIntents`.
- Generate `intent` values from the result of `Await.define(...)`.
- Parameters must be encodable values.
- If you need continuous movement or interaction transitions, give visual entities stable `id` values.

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

## Data And Capabilities

- Use `AwaitStore` for persistent state.
- Use `AwaitNetwork.request(...)` for networking. Do not use `fetch`.
- Use `AwaitFile` when file access is needed.
- Use `AwaitEnv` when the widget `id` or `tag` is needed.

## Decision Order

1. Check `node_modules/@await-widget/runtime/runtime/await.d.ts` to see whether the component exists.
2. Check `node_modules/@await-widget/runtime/types/prop.d.ts` to see whether the prop or modifier is valid.
3. Check `node_modules/@await-widget/runtime/runtime/bridge.d.ts` to see whether the native bridge API exists.
4. If it is not in the `@await-widget/runtime` declarations, treat it as unavailable.
