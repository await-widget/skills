# Timeline

`widgetTimeline(context)` is optional. Use it when a widget needs dated entry data or scheduled visual changes.

## Shape

```tsx
type Timeline<T> = {
	entries: Array<{date: Date} & T>;
	update?: Date | 'end' | 'rapid' | 'never';
	skipOnPlayingNote?: boolean;
};
```

## Example

```tsx
import {Text, VStack} from 'await';

type EntryData = {
	value: string;
};

function widget(entry: WidgetEntry<EntryData>) {
	return (
		<VStack maxSides padding={16}>
			<Text value={entry.value}/>
		</VStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	return {
		entries: [{date: new Date(), value: 'Updated'}],
		update: 'end',
	};
}

Await.define({
	widget,
	widgetTimeline,
});
```

## Guidance

- Omit `widgetTimeline` if the widget does not need scheduled updates.
- Prefer a single entry unless multiple visible states are needed.
- More entries increase render cost.
- For continuous changes, cover at least about `15m04s + buffer` of timeline entries.
- For fastest practical refresh, use `update: 'rapid'`.
