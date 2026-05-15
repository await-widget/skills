import {
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

const tone = {
	background: '111B18',
	foreground: 'F1FCF7',
	accent: '90E2B1',
	muted: 'C4EDD4',
	subtle: '9FC3AD',
};

type EntryData = {
	latitude: string;
	longitude: string;
	updatedAt: string;
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
						value='Location'
						fontSize={11 * fontScale}
						fontWeight={700}
						foreground={tone.accent}
						lineLimit={1}
					/>
					: undefined}
				<Text
					value={entry.latitude}
					fontSize={18 * fontScale}
					fontWeight={700}
					lineLimit={1}
					minimumScaleFactor={0.74}
				/>
				<Text
					value={entry.longitude}
					fontSize={18}
					fontWeight={700}
					lineLimit={1}
					minimumScaleFactor={0.74}
				/>
				<Text
					value={entry.updatedAt}
					fontSize={10}
					fontWeight={600}
					foreground={tone.subtle}
					lineLimit={1}
					minimumScaleFactor={0.75}
				/>
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const location = await AwaitLocation.get();
	if (location === undefined) {
		return {
			entries: [{
				date: new Date(),
				latitude: 'Unavailable',
				longitude: '--',
				updatedAt: 'Check permission',
			}],
			update: new Date(Date.now() + 1_800_000),
		};
	}

	const {date} = location;
	return {
		entries: [{
			date: new Date(),
			latitude: `Lat ${location.latitude.toFixed(4)}`,
			longitude: `Lon ${location.longitude.toFixed(4)}`,
			updatedAt: formatClockTime(date),
		}],
		update: new Date(Date.now() + 1_800_000),
	};
}

function pad2(value: number) {
	return value.toString().padStart(2, '0');
}

function formatClockTime(date: Date) {
	return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

Await.define({
	widget,
	widgetTimeline,
});
