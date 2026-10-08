import {
	Button,
	Circle,
	Color,
	HStack,
	Modifier,
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
	sounds,
	allBlackNotes,
	allWhiteNotes,
	chords,
	defaultIndex,
	topHeight,
	blackKeyStyle,
	whiteKeyStyle,
} from './constants';

// @panel {type:'slider',min:0,max:0.5,title:'Chord Separation',title_zh:'和弦分离'}
const delay = 0;

const colors = {
	base: '#1B1C24',
	surface: '#343543',
	light: '#E4E5EF',
	toolbarSeparator: '#922C3A',
	whiteKeyFace: '#F7F7FD',
	blackKeyBevel: '#4B4D60',
	blackKeyFace: '#434558',
};

const shadow: Shadow = {
	color: [colors.base, 0.2], blur: 2, y: 4,
};

function widget(entry: WidgetEntry) {
	const {
		size: {width, height},
	} = entry;
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
	const title = `${sound.isChord ? 'CHORD' : 'PIANO'}${shift === 0 ? '' : (shift > 0 ? ` +${shift}` : ` ${shift}`)}`;

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
		<VStack background={colors.base}>
			<Buttons width={width} title={title} />
			<ZStack alignment='top'>
				<WhiteKeys {...data} />
				<BlackKeys {...data} />
			</ZStack>
		</VStack>
	);
}

function getNotes(note: number, shift: number, sound: Sound) {
	if (!sound.isChord) {
		return [note + shift];
	}

	const notes = chords[note % 12]?.map(diff => note + diff + shift) ?? [
		note + shift,
	];
	return notes;
}

function playNote(notes: number[], sound: Sound) {
	const duration = notes.length > 1 ? 5 : 3;
	AwaitAudio.playNote(notes, {
		duration,
		soundFont: sound.path,
		velocity: sound.velocity,
		delay,
	});
}

function getAllNotes(): Notes {
	const offset = AwaitStore.num('offset');
	const count = AwaitStore.num('count', 12);
	const countPadding = count + 2;
	const startNote = defaultIndex + offset;
	const whiteNotes = allWhiteNotes.slice(startNote, startNote + countPadding);
	const blackNotes = allBlackNotes.slice(
		startNote,
		startNote + countPadding + 1,
	);
	return {whiteNotes, blackNotes};
}

function setShift(value: number) {
	const shift = AwaitStore.num('shift');
	AwaitStore.set('shift', Math.max(-12, Math.min(12, shift + value)));
	AwaitStore.set('ttl', Date.now());
}

function setOffset(value: number) {
	const offset = AwaitStore.num('offset');
	const count = AwaitStore.num('count', 12);
	AwaitStore.set(
		'offset',
		Math.max(
			-defaultIndex,
			Math.min(allWhiteNotes.length - count - defaultIndex, offset + value),
		),
	);
	AwaitStore.set('ttl', Date.now());
}

function setCount(value: number) {
	const count = AwaitStore.num('count', 12);
	AwaitStore.set('count', Math.max(3, Math.min(15, count + value)));
	AwaitStore.set('ttl', Date.now());
}

function getSound(): Sound {
	const soundIndex = AwaitStore.num('soundIndex');
	return sounds[soundIndex % sounds.length];
}

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
			<ZStack width={32} maxHeight>
				<Circle fill={colors.base} sides={26} />
				<Circle fill={colors.surface} sides={22} />
				<Svg url={icon} sides={24} />
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
			background={colors.surface}
			padding_={{bottom: 2}}
			background_={colors.toolbarSeparator}
			frame={{width, height: topHeight}}
			buttonStyle='borderless'
			fontSize={12}
			fontDesign='rounded'
			fontWeight={900}
			foreground={colors.light}
			zIndex={1}
			compositingGroup
			shadow={shadow}
		>
			{left.map(({intent, icon}) => (
				<SmallButton intent={intent} icon={icon} />
			))}
			<Button intent={app.switchSound()} audio>
				<ZStack padding={{horizontal: 8}} maxHeight>
					<Text value={title} maxSides contentTransition='opacity' />
				</ZStack>
			</Button>
			{right.map(({intent, icon}) => (
				<SmallButton intent={intent} icon={icon} />
			))}
		</HStack>
	);
}

function WhiteKeys(data: Data) {
	const {whiteKeysWidth, whiteNotes, shift, sound} = data;
	return (
		<HStack width={whiteKeysWidth}>
			{whiteNotes.map(note =>
				note === undefined
					? (
						<Color />
					)
					: (
						<Button
							id={note * 100}
							audio
							fast
							intent={app.playNote(getNotes(note, shift, sound), sound)}
							buttonStyle={whiteKeyStyle}
						>
							<ZStack padding={{horizontal: 1}}>
								<UnevenRoundedRectangle
									fill={colors.light}
									rectRadius={{bottom: 4}}
								/>
								<UnevenRoundedRectangle
									fill={colors.whiteKeyFace}
									rectRadius={{bottom: 2}}
									padding={{horizontal: 2, bottom: 2}}
								/>
							</ZStack>
						</Button>
					))}
		</HStack>
	);
}

function BlackKeys(data: Data) {
	const {
		blackNotes,
		blackKeyWidth,
		blackKeysWidth,
		blackKeyHeight,
		shift,
		sound,
	} = data;
	return (
		<HStack frame={{height: blackKeyHeight, width: blackKeysWidth}} compositingGroup shadow={shadow}>
			{blackNotes.map(note =>
				note === undefined
					? (
						<Color />
					)
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
									fill={colors.base}
									rectRadius={{bottom: 8}}
								/>
								<UnevenRoundedRectangle
									fill={colors.blackKeyBevel}
									rectRadius={{bottom: 4}}
									padding={{horizontal: 4, bottom: 4}}
								/>
								<UnevenRoundedRectangle
									fill={colors.blackKeyFace}
									rectRadius={{bottom: 2}}
									padding={{horizontal: 6, bottom: 6}}
								/>
							</ZStack>
						</Button>
					))}
		</HStack>
	);
}

function widgetTimeline() {
	return {
		entries: [{date: new Date()}],
		skipOnPlayingNote: Date.now() - AwaitStore.num('ttl') > 500 && AwaitEnv.host === 'widget',
	};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		playNote,
		setShift,
		setOffset,
		switchSound,
		setCount,
	},
	widgetFamilies: ['medium'],
});
