# Bridge APIs

Bridge APIs are globals provided by Await. Use the generated [Bridge APIs Reference](../reference/bridge-apis.md) for exact signatures.

## Common APIs

- `AwaitStore`: persistent key-value state.
- `AwaitNetwork`: network requests through `AwaitNetwork.request`, not `fetch`.
- `AwaitFile`: file access inside the widget directory.
- `AwaitWeather`: weather data.
- `AwaitCalendar`: calendar data.
- `AwaitReminder`: reminders.
- `AwaitHealth`: health summary data.
- `AwaitLocation`: location data.
- `AwaitMedia`: now playing media and media commands.
- `AwaitAudio`: audio, MIDI, sound font, and note APIs.
- `AwaitSystem`: battery, CPU, memory, and storage data.
- `AwaitUI`: display scale and haptics.
- `AwaitEnv`: widget id, tag, and host.

## Store Example

```tsx
const count = AwaitStore.num('count', 0);
AwaitStore.set('count', count + 1);
```

## Network Example

```tsx
const response = await AwaitNetwork.request('https://example.com/data.json');
const data = JSON.parse(response.data);
```

## Weather Timeline Example

```tsx
type EntryData = {
	temperature?: number;
	symbolName?: string;
};

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const weather = await AwaitWeather.get({hourlyLimit: 4, dailyLimit: 3});
	return {
		entries: [{
			date: new Date(),
			temperature: weather?.current.temperatureCelsius,
			symbolName: weather?.current.symbolName,
		}],
		update: 'end',
	};
}
```

## File Boundaries

`AwaitFile` can interact only with files located within the widget directory. Do not access hidden paths or parent directories.

