import {
	Button,
	Capsule,
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
	background: '171A27',
	foreground: 'F9FAFF',
	accent: 'F7A2C5',
	muted: 'E1D7E7',
	buttonFill: 'E9588F',
	buttonForeground: 'FFF8FC',
};

type EntryData = {
	title: string;
	artist: string;
	action: string;
};

const source: AwaitMediaPlayConfig = {source: 'station', type: 'discovery'};

function widget(entry: WidgetEntry<EntryData>) {
	return (
		<ZStack maxSides>
			<Color value={tone.background}/>
			<VStack spacing={9} padding={16} foreground={tone.foreground} fontDesign='rounded'>
				{showLabel
					? <Text
						value='Apple Music'
						fontSize={11}
						fontWeight={700}
						foreground={tone.accent}
						lineLimit={1}
					/>
					: undefined}
				<Text
					value={entry.title}
					fontSize={17 * fontScale}
					fontWeight={700}
					lineLimit={2}
					minimumScaleFactor={0.74}
				/>
				<Text
					value={entry.artist}
					fontSize={11}
					fontWeight={600}
					foreground={tone.muted}
					lineLimit={1}
					minimumScaleFactor={0.75}
				/>
				<Button intent={app.play()} audio buttonStyle='borderless'>
					<Text
						value={entry.action}
						fontSize={11}
						fontWeight={800}
						foreground={tone.buttonForeground}
						lineLimit={1}
						minimumScaleFactor={0.75}
						padding={{horizontal: 12, vertical: 7}}
						background={tone.buttonFill}
						clipShape={<Capsule/>}
					/>
				</Button>
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const media = await AwaitMedia.nowPlayingMedia({artworkSize: 120});
	return {
		entries: [{
			date: new Date(),
			title: media.title ?? 'Discovery Station',
			artist: media.artistName ?? 'Tap to request Music access',
			action: media.state === 'playing' ? 'Pause' : 'Play',
		}],
		update: 'never',
	};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		async play() {
			await AwaitMedia.mediaPlayerCommand('toggle', source);
		},
	},
});
