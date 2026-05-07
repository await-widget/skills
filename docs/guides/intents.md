# Intents

Use `widgetIntents` for user-triggered actions from buttons.

## Rules

- Register intent functions under `widgetIntents`.
- Generate `intent` values from the object returned by `Await.define`.
- Intent parameters must be encodable values: strings, numbers, booleans, `undefined`, arrays, or plain objects containing encodable values.

## Example

```tsx
import {Button, Text, VStack} from 'await';

function add(step: number) {
	const count = AwaitStore.num('count', 0);
	AwaitStore.set('count', count + step);
}

function widget() {
	const count = AwaitStore.num('count', 0);
	return (
		<VStack spacing={8} maxSides padding={16}>
			<Text value={count} fontSize={28}/>
			<Button intent={app.add(1)}>
				<Text value='Add'/>
			</Button>
		</VStack>
	);
}

const app = Await.define({
	widget,
	widgetIntents: {add},
});
```

## Animation Notes

- Use stable `id` values for visual entities that move or animate.
- Widget animation duration is capped at 2 seconds.
- For moving entities, prefer a stable outer shell with `id` and `offset`.
- Do not put `offset` and `transition='scale'` on the same node.

