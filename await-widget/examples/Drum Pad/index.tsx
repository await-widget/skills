import {
	Button,
	Modifier,
	HStack,
	Text,
	VStack,
	RoundedRectangle,
	ZStack,
} from 'await';

// @panel {type:'slider',min:0,max:1,step:0.05}
const foreground = 0.1;
// @panel {type:'slider',min:0,max:1,step:0.05}
const background = 0.9;
// @panel {type:'slider',min:0,max:1,step:0.05}
const buttonFill = 0.95;

function widget() {
	return (
		<VStack
			spacing={4}
			padding={8}
			{...font}
			maxSides
			background={background}
			foreground={foreground}
			buttonStyle={buttonStyle}
		>
			{grid.map((row, y) => (
				<HStack spacing={4}>
					{row.map((_, x) => {
						const note = grid[y]![x]!;
						return <Cell note={note} />;
					})}
				</HStack>
			))}
		</VStack>
	);
}

function Cell({ note }: { note: number }) {
	const name = noteNames[note]![0];
	const velocity = noteNames[note]![1] * 127;
	return (
		<Button fast intent={app.tap(note, velocity)} audio>
			<ZStack>
				<RoundedRectangle rectRadius={86 / 3 - 8} fill={buttonFill} />
				<Text value={name.toUpperCase()} padding={8} />
			</ZStack>
		</Button>
	);
}

function widgetTimeline() {
	return { entries: [{ date: new Date() }], skipOnPlayingNote: true };
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		tap(note: number, velocity: number) {
			AwaitAudio.playNote(note, {
				soundFont: '/assets/sounds/909.sf2',
				bank: 128,
				volume: 2,
				velocity,
			});
		},
	},
});

const noteNames: Record<number, [string, number]> = {
	36: ['Kick', 1],
	37: ['Rim', 1],
	38: ['Snare', 1],
	39: ['Clap', 1],
	42: ['Closed Hat', 1],
	46: ['Open Hat', 1],
	50: ['Tom Hi', 1],
	51: ['Ride', 1],
};

const grid = [
	[39, 51, 46],
	[38, 36, 42],
];

const buttonStyle: CustomButtonStyle = {
	press: (
		<Modifier
			geometryGroup
			scaleEffect={0.9}
			animation={{ type: 'snappy', duration: 0.1 }}
		/>
	),
	normal: (
		<Modifier
			geometryGroup
			scaleEffect={1}
			animation={{ type: 'snappy', duration: 0.5 }}
		/>
	),
};

const font: Mods = {
	fontSize: 10,
	fontDesign: 'rounded',
	fontWeight: 900,
	textAlignment: 'center',
};
