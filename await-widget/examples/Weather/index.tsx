import {
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel {type:'slider',min:0.5,max:2}
const fontScale = 1;
// @panel
const showLabel = true;

const tone = {
	background: '101826',
	foreground: 'F0F8FF',
	accent: '8DCBFF',
	muted: 'C7E7FF',
	subtle: '9CBFD9',
};

type EntryData = {
	condition: string;
	temperature: string;
	highLow: string;
	humidity: string;
	wind: string;
};

function widget(entry: WidgetEntry<EntryData>) {
	return (
		<ZStack maxSides>
			<Color value={tone.background}/>
			<VStack spacing={8} padding={16} foreground={tone.foreground} fontDesign='rounded'>
				{showLabel
					? <Text
						value='Weather'
						fontSize={11}
						fontWeight={700}
						foreground={tone.accent}
						lineLimit={1}
					/>
					: undefined}
				<Text
					value={entry.temperature}
					fontSize={31 * fontScale}
					fontWeight={800}
					lineLimit={1}
					minimumScaleFactor={0.72}
					contentTransition='numericText'
				/>
				<Text
					value={entry.condition}
					fontSize={15}
					fontWeight={700}
					lineLimit={1}
					minimumScaleFactor={0.74}
				/>
				<Text
					value={entry.highLow}
					fontSize={11}
					fontWeight={600}
					foreground={tone.muted}
					lineLimit={1}
					minimumScaleFactor={0.75}
				/>
				<Text
					value={`${entry.humidity} · ${entry.wind}`}
					fontSize={10}
					fontWeight={600}
					foreground={tone.subtle}
					lineLimit={1}
					minimumScaleFactor={0.7}
				/>
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const weather = await AwaitWeather.get();
	if (weather) {
		const {current, daily} = weather;
		const [today] = daily;
		return {
			entries: [{
				date: new Date(),
				condition: current.condition,
				temperature: `${Math.round(current.temperatureCelsius)} C`,
				highLow: today === undefined ? 'Apple Park' : `H ${Math.round(today.highTemperatureCelsius)} C / L ${Math.round(today.lowTemperatureCelsius)} C`,
				humidity: `${Math.round(current.humidity * 100)}% humidity`,
				wind: `${Math.round(current.windSpeedMetersPerSecond)} m/s wind`,
			}],
			update: new Date(Date.now() + 1_800_000),
		};
	}
	return {
		entries: [{
			date: new Date(),
			condition: '--',
			temperature: '--',
			highLow: '--',
			humidity: '--',
			wind: '--',
		}],
		update: new Date(Date.now() + 1_800_000),
	};
}

Await.define({
	widget,
	widgetTimeline,
});
