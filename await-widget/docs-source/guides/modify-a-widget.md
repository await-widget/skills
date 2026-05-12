# Modify A Widget

When changing an existing widget, preserve the existing runtime shape unless the request requires a larger change.

## Steps

1. Read the target `index.tsx`.
2. Identify imports, top-level `@panel` constants, `widget`, optional `widgetTimeline`, optional intent functions, and `Await.define`.
3. Check the reference before adding components, props, modifiers, or bridge APIs.
4. Make the smallest code change that satisfies the request.
5. Run `npm test` in the widget project.

## Keep Stable

- Do not replace `Await.define` with a different registration style.
- Do not introduce HTML, CSS, browser APIs, React hooks, or React state.
- Do not move `@panel` comments away from the top-level declaration they control.
- Do not add compatibility layers unless explicitly requested.

## Common Changes

- Visual tuning: adjust props and modifiers on existing nodes.
- Editable settings: add top-level `const` declarations with `@panel`.
- Refreshing data: add or update `widgetTimeline`.
- Tap actions: add an intent function, register it under `widgetIntents`, and use the returned intent factory from `Await.define`.
