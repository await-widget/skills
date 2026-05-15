import {
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

const tone = {
	background: '171720',
	foreground: 'FFF4F6',
	accent: 'F5A8BC',
	muted: 'F2D2DB',
};

type EntryData = {
	stepCount: string;
	distanceWalkingRunning?: string;
	flightsClimbed?: string;
};

// @panel {type:'slider',min:0.5,max:2}
const fontScale = 1;
// @panel
const showLabel = true;

function widget(entry: WidgetEntry<EntryData>) {
	return (
		<ZStack maxSides>
			<Color value={tone.background}/>
			<VStack spacing={8} padding={16} foreground={tone.foreground} fontDesign='rounded'>
				{showLabel
					? <Text
						value='Health'
						fontSize={11 * fontScale}
						fontWeight={700}
						foreground={tone.accent}
						lineLimit={1}
					/>
					: undefined}
				<Text
					value={entry.stepCount}
					fontSize={30 * fontScale}
					fontWeight={800}
					lineLimit={1}
					minimumScaleFactor={0.72}
					contentTransition='numericText'
				/>
				<Text
					value='steps today'
					fontSize={11}
					fontWeight={600}
					foreground={tone.muted}
					lineLimit={1}
					minimumScaleFactor={0.75}
				/>
				{entry.distanceWalkingRunning
					? <Text
						value={entry.distanceWalkingRunning}
						fontSize={14}
						fontWeight={700}
						lineLimit={2}
						minimumScaleFactor={0.74}
					/>
					: undefined}
				{entry.flightsClimbed
					? <Text
						value={entry.flightsClimbed}
						fontSize={11}
						fontWeight={600}
						foreground={tone.muted}
						lineLimit={1}
						minimumScaleFactor={0.75}
					/>
					: undefined}
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const info = await AwaitHealth.get();
	return {
		entries: [{
			date: new Date(),
			stepCount: formatCount(info?.stepCount),
			distanceWalkingRunning: formatDistance(info?.distanceWalkingRunning),
			flightsClimbed: formatFlights(info?.flightsClimbed),
		}],
		update: new Date(Date.now() + 1_800_000),
	};
}

function formatCount(value: number | undefined) {
	return value === undefined ? '--' : Math.round(value).toString();
}

function formatDistance(value: number | undefined) {
	return value === undefined ? undefined : `${(value / 1000).toFixed(2)} km`;
}

function formatFlights(value: number | undefined) {
	return value === undefined ? undefined : `${Math.round(value)} flights climbed`;
}

Await.define({
	widget,
	widgetTimeline,
});
