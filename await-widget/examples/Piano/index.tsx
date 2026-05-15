import {
	Button,
	Circle,
	Color,
	HStack,
	Svg,
	Text,
	UnevenRoundedRectangle,
	VStack,
	ZStack,
} from 'await';
import {
	type Data,
	type Notes,
	type Sound,
	allBlackNotes,
	allWhiteNotes,
	blackKeyStyle,
	chords,
	defaultIndex,
	topHeight,
	whiteKeyStyle,
} from './constants';

const darkest = 0.1;

function widget(entry: WidgetEntry) {
	const {size: {width, height}} = entry;
	const sound = getSound();
	const shift = AwaitStore.num('shift');
	const {whiteNotes, blackNotes} = getAllNotes();
	const keyWidthWithPadding = (width + 2) / (whiteNotes.length - 2);
	const keyWidth = keyWidthWithPadding - 2;
	const whiteKeysWidth = keyWidthWithPadding * whiteNotes.length;
	const blackKeyWidth = keyWidth / 1.414;
	const blackKeysWidth = whiteKeysWidth + keyWidthWithPadding;
	const keyHeight = height - topHeight;
	const blackKeyHeight = keyHeight / 2;
	const title = `${sound.name}${shift === 0 ? '' : (shift > 0 ? ` +${shift}` : ` ${shift}`)}`;

	const data: Data = {
		whiteKeysWidth,
		blackKeyWidth,
		blackKeysWidth,
		blackKeyHeight,
		sound,
		shift,
		whiteNotes,
		blackNotes,
	};
	return (
		<VStack background={darkest}>
			<Buttons width={width} title={title}/>
			<ZStack alignment='top'>
				<WhiteKeys {...data}/>
				<BlackKeys {...data}/>
			</ZStack>
		</VStack>
	);
}

function getNotes(note: number, shift: number, sound: Sound) {
	if (!sound.isChord) {
		return [note + shift];
	}

	const notes = chords[note % 12]?.map(diff => note + diff + shift) ?? [note + shift];
	return notes;
}

function playNote(notes: number[], sound: Sound) {
	const duration = notes.length > 1 ? 5 : 3;
	AwaitAudio.playNote(notes, {
		duration, soundFont: sound.path, velocity: sound.velocity,
	});
}

function getAllNotes(): Notes {
	const offset = AwaitStore.num('offset');
	const count = AwaitStore.num('count', 10);
	const countPadding = count + 2;
	const startNote = defaultIndex + offset;
	const whiteNotes = allWhiteNotes.slice(startNote, startNote + countPadding);
	const blackNotes = allBlackNotes.slice(startNote, startNote + countPadding + 1);
	return {whiteNotes, blackNotes};
}

function setShift(value: number) {
	const shift = AwaitStore.num('shift');
	AwaitStore.set('shift', Math.max(-12, Math.min(12, shift + value)));
	AwaitStore.set('ttl', Date.now());
}

function setOffset(value: number) {
	const offset = AwaitStore.num('offset');
	const count = AwaitStore.num('count', 10);
	AwaitStore.set('offset', Math.max(-defaultIndex, Math.min(allWhiteNotes.length - count - defaultIndex, offset + value)));
	AwaitStore.set('ttl', Date.now());
}

function setCount(value: number) {
	const count = AwaitStore.num('count', 10);
	AwaitStore.set('count', Math.max(3, Math.min(15, count + value)));
	AwaitStore.set('ttl', Date.now());
}

function getSound(): Sound {
	const soundIndex = AwaitStore.num('soundIndex');
	return sounds[soundIndex % sounds.length]!;
}

const sounds: Sound[] = [
	{
		path: '/assets/sounds/Gran.sf2', velocity: 127, name: 'GRAN', isChord: false,
	},
	{
		path: '/assets/sounds/Gran.sf2', velocity: 127, name: 'GRAN CH', isChord: true,
	},
	{
		path: '/assets/sounds/Elec.sf2', velocity: 64, name: 'ELEC', isChord: false,
	},
	{
		path: '/assets/sounds/Elec.sf2', velocity: 64, name: 'ELEC CH', isChord: true,
	},
];

function switchSound() {
	const soundIndex = AwaitStore.num('soundIndex');
	AwaitStore.set('soundIndex', soundIndex + 1);
	AwaitStore.set('ttl', Date.now());
	const {path} = getSound();
	AwaitAudio.playNote([], {soundFont: path});
}

function SmallButton({intent, icon}: {intent: IntentInfo; icon: string}) {
	return (
		<Button intent={intent}>
			<ZStack width={36} maxHeight>
				<Circle fill={darkest} sides={28}/>
				<Circle fill={0.2} sides={24}/>
				<Svg url={icon} sides={24}/>
			</ZStack>
		</Button>
	);
}

function Buttons({title, width}: {title: string; width: number}) {
	const left = [
		{intent: app.setOffset(-1), icon: 'assets/right.svg'},
		{intent: app.setCount(-1), icon: 'assets/minus.svg'},
		{intent: app.setShift(-1), icon: 'assets/fall.svg'},
	];
	const right = [
		{intent: app.setShift(1), icon: 'assets/lift.svg'},
		{intent: app.setCount(1), icon: 'assets/add.svg'},
		{intent: app.setOffset(1), icon: 'assets/left.svg'},
	];
	return (
		<HStack
			padding={{horizontal: 12}}
			background={0.2}
			padding_={{bottom: 2}}
			frame={{width, height: topHeight}}
			buttonStyle='borderless'
			fontSize={12}
			fontDesign='monospaced'
			fontWeight={800}
			foreground={0.9}
			zIndex={1}
		>
			{left.map(({intent, icon}) => <SmallButton intent={intent} icon={icon}/>)}
			<Button intent={app.switchSound()} audio>
				<ZStack padding={{horizontal: 8}} maxHeight>
					<Text value={title} maxSides contentTransition='numericText'/>
				</ZStack>
			</Button>
			{right.map(({intent, icon}) => <SmallButton intent={intent} icon={icon}/>)}
		</HStack>
	);
}

function WhiteKeys(data: Data) {
	const {whiteKeysWidth, whiteNotes, shift, sound} = data;
	return (
		<HStack width={whiteKeysWidth}>
			{whiteNotes.map(note => note === undefined
				? <Color/>
				: <Button
					id={note * 100}
					audio
					fast
					intent={app.playNote(getNotes(note, shift, sound), sound)}
					buttonStyle={whiteKeyStyle}
				>
					<ZStack padding={{horizontal: 1}}>
						<UnevenRoundedRectangle
							fill={{gradient: 'linear', colors: [0.8 * 0.9, 0.9 * 0.9]}}
							rectRadius={{bottom: 4}}
						/>
						<UnevenRoundedRectangle
							fill={{gradient: 'linear', colors: [0.8, 0.9]}}
							rectRadius={{bottom: 2}}
							padding={{horizontal: 2, bottom: 2}}
						/>
					</ZStack>
				</Button>)
			}
		</HStack>
	);
}

function BlackKeys(data: Data) {
	const {blackNotes, blackKeyWidth, blackKeysWidth, blackKeyHeight, shift, sound} = data;
	const x = blackKeyHeight / (blackKeyHeight + 10);
	return (
	// 用blackKeysWidth强迫扩大黑键区域
		<HStack frame={{height: blackKeyHeight, width: blackKeysWidth}}>
			{blackNotes.map(note => (
				note === undefined
					? <Color/> // Spacer优先级不如Shape，会被压缩到0，Color优先级和Shape一样
					: (
						<Button
							id={note * 100}
							audio
							fast
							intent={app.playNote(getNotes(note, shift, sound), sound)}
							buttonStyle={blackKeyStyle}
						>
							<ZStack alignment='bottom' width={blackKeyWidth} maxWidth>
								<UnevenRoundedRectangle
									fill={{gradient: 'linear', stops: [[[darkest, 0.2], x], [[darkest, 0], 1]]}}
									padding={{bottom: -10}}
								/>
								<UnevenRoundedRectangle
									fill={darkest}
									rectRadius={{bottom: 8}}
								/>
								{/* <UnevenRoundedRectangle
									fill={0.2}
									rectRadius={{bottom: 6}}
									padding={{horizontal: 2, bottom: 2}}
								/> */}
								<UnevenRoundedRectangle
									fill={{gradient: 'linear', colors: [0.3, 0.4]}}
									rectRadius={{bottom: 4}}
									padding={{horizontal: 4, bottom: 4}}
								/>
								<UnevenRoundedRectangle
									fill={{gradient: 'linear', colors: [0.3 * 0.9, 0.4 * 0.9]}}
									rectRadius={{bottom: 2}}
									padding={{horizontal: 6, bottom: 6}}
								/>
							</ZStack>
						</Button>
					)
			))}
		</HStack>
	);
}

function widgetTimeline() {
	return {entries: [{date: new Date()}], skipOnPlayingNote: Date.now() - AwaitStore.num('ttl') > 500};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		playNote, setShift, setOffset, switchSound, setCount,
	},
});
