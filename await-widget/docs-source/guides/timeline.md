# Timeline

## Overview

`widgetTimeline()` is optional. Omit `widgetTimeline` if the widget does not need scheduled updates.

## Rules

- **Prefer single entry**: Use one entry unless multiple visible states are required.
- **Control render cost**: More entries increase render cost.
- **Refresh only when needed**: If the widget does not need another timeline request, omit `update`; omission uses the default `never` policy. If it does, schedule the next refresh about 30 minutes later.
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

Declare `widgetTimeline` as `async` when it must finish asynchronous work, such as a network request, before returning entries. The widget view refreshes after the promise resolves.

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
