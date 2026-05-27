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
// @panel {type:'menu',items:['Elec.sf2','Gran.sf2','Harp.sf2','Music Box.sf2']}
const soundFont = 'Elec.sf2';

const noteChar = ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7'];

function widget() {
	return (
		<VStack spacing={4} padding={8} {...font} maxSides background={background} foreground={foreground} buttonStyle={buttonStyle}>
			{grid.map(row =>
				<HStack spacing={4}>
					{row.map(note => <Cell note={note}/>)}
				</HStack>)}
		</VStack>
	);
}

function Cell({note}: {note: number}) {
	const name = noteName(note);
	return (
		<Button fast intent={app.tap(note)} audio>
			<ZStack>
				<RoundedRectangle rectRadius={86 / 3 - 8} fill={buttonFill}/>
				<Text value={name.toUpperCase()} padding={8}/>
			</ZStack>
		</Button>
	);
}

function widgetTimeline() {
	return {entries: [{date: new Date()}], skipOnPlayingNote: true};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		tap(note: number) {
			AwaitAudio.playNote(note, {
				soundFont: `/assets/sounds/${soundFont}`,
			});
		},
	},
});

function noteName(note: number) {
	return noteChar[note % 12]! + '\u0307'.repeat(Math.floor(note / 12) - 5);
}

const grid = [
	[60, 62, 64, 65, 67],
	[69, 71, 72, 74, 76],
	[77, 79, 81, 83, 84],
];

const buttonStyle: CustomButtonStyle = {
	press: <Modifier
		geometryGroup
		scaleEffect={0.9}
		animation={{type: 'snappy', duration: 0.1}}
	/>,
	normal: <Modifier
		geometryGroup
		scaleEffect={1}
		animation={{type: 'snappy', duration: 0.5}}
	/>,
};

const font: Mods = {
	fontSize: 18,
	fontDesign: 'rounded',
	fontWeight: 900,
	monospacedDigit: true,
	textAlignment: 'center',
};
