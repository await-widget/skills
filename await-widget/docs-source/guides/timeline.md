# Timeline

## Overview

`widgetTimeline()` is optional. Omit `widgetTimeline` if the widget does not need scheduled updates.

## Rules

- **Prefer single entry**: Use one entry unless multiple visible states are required.
- **Control render cost**: More entries increase render cost.
- **Refresh only when needed**: Otherwise, leave it unset. If needed, a 30-minute refresh interval is recommended.
- **Rapid refresh mode**: Use `update: 'rapid'` to reduce the refresh interval to the minimum available.

## Example

```tsx

function widgetTimeline(): Timeline {
	return {
		entries: [{date: new Date()}],
		update: 'rapid',
	};
}
```

## Async Support

`widgetTimeline` supports async/await syntax for cases where asynchronous operations (e.g., network requests) are needed before returning the timeline. The widget view refreshes after `widgetTimeline` resolves.

```tsx
type EntryData = {
	value: string;
};

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const res = await AwaitNetwork.request('https://api.example.com/data');
	const string = res.data;
	return {
		entries: [{date: new Date(), value: string}],
	};
}
```
