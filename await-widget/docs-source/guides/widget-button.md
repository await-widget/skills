# Widget Button

Use `widgetIntents` for button-triggered actions in widgets.

## Constraints

- **No swipe or long press**: iOS Home Screen widgets only support taps. Swipe is reserved for Home Screen navigation; long press triggers the widget menu.
- **Stateless**: Widgets are stateless — functions cannot be held in memory directly. They must be registered via `widgetIntents`.

## Rules

- Register intent functions inside `widgetIntents`.
- Generate `intent` values from the object returned by `Await.define`.
- Intent parameters must be encodable: strings, numbers, booleans, `undefined`, arrays, or plain objects containing those values.

## Tips

- **Transparent buttons**: If a fully transparent `Button` is untappable, avoid `'plain'` buttonStyle. Use `'borderless'` instead, or fill the button with a `Color` at 0.001 opacity.
- **Hit area**: On Home Screen widgets, `contentShape` has no effect — the tappable area is always rectangular. Use `rotationEffect` to change the angle of the tappable area.

## Example

```tsx
import {Button, Text, VStack} from 'await';

function add(step: number) {
	AwaitStore.set('count', AwaitStore.num('count') + step);
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
