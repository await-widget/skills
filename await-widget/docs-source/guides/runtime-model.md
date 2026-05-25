# Runtime Model

Await widgets are TSX files compiled with the Await JSX runtime. The component tree is a native view description consumed by Await on iOS.

The core loop is a pull model: `widgetTimeline()` generates future entries, the system pulls one entry at its date, and `widget(entry)` renders that entry. If there is no timeline, Await renders the widget from a single current entry.

## Minimal Shape

```tsx
import {Text, ZStack} from 'await';

function widget() {
	return (
		<ZStack maxSides>
			<Text value='Hello, Await'/>
		</ZStack>
	);
}

Await.define({
	widget,
});
```

## What Exists

- Components are exported by the `await` module.
- Global APIs such as `Await`, `AwaitStore`, `AwaitNetwork`, and `AwaitWeather` are provided by the host.
- Types come from `@await-widget/runtime`.
- Widget source uses `jsxImportSource: "await"` and `types: ["@await-widget/runtime"]`.

## What Does Not Exist

- Browser DOM, HTML tags, CSS, React hooks, React state, and browser `fetch`.
- APIs not declared in `runtime/types/*.d.ts`.
- Full app authorization flows inside widgets. Permission-sensitive APIs should be treated as already authorized by the host or currently unavailable.

## Data Flow

- `widget(entry)` renders the current view.
- `widgetTimeline()` optionally produces dated entries.
- `widgetIntents` optionally registers user-triggered actions.
- Persistent state usually lives in `AwaitStore`.

## Complexity Rule

Widget cost is roughly:

```text
timeline entries * view tree node count
```

Prefer one timeline entry unless visible output needs multiple entries.
