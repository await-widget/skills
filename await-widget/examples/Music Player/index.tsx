import {
	Button,
	Circle,
	HStack,
	Icon,
	Image,
	Spacer,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel
const query = '';
// @panel {type:'slider',min:1,max:50,step:1}
const limit = 25;
// @panel {type:'menu',items:['song','album','artist','station']}
const source = 'station';
// @panel {type:'menu',items:['user','discovery']}
const type = 'user';
// @panel
const id = '';

const artworkSize = 400;
const defaultStation: AwaitMusicPlayConfig = {
	source, query, limit, id, type,
};
const outerPadding = 16;
const columnGap = 18;
const widgetRadius = 86 / 3;
const artworkRadius = widgetRadius - outerPadding;
const smallPadding = 10;
const largePadding = 16;
const controlSide = 40;

type EntryData = {nowPlaying: AwaitNowPlayingInfo};
type PlayerInfo = ReturnType<typeof getPlayerInfo>;

function widget(entry: WidgetEntry<EntryData>) {
	if (entry.family === 'small') {
		return <SmallWidget entry={entry}/>;
	}

	if (entry.family === 'large' || entry.family === 'extraLarge') {
		return <LargeWidget entry={entry}/>;
	}

	return <MediumWidget entry={entry}/>;
}

function SmallWidget({entry}: {
	entry: WidgetEntry<EntryData>;
}) {
	const {nowPlaying} = entry;
	const {width, height} = entry.size;
	const background = nowPlaying.backgroundColor ?? '24211F';
	const side = Math.min(width, height) - smallPadding * 2;

	return (
		<ZStack padding={smallPadding} maxSides background={background}>
			<Artwork
				url={nowPlaying.artworkURL}
				side={side}
				background={background}
				radius={widgetRadius - smallPadding}
			/>
		</ZStack>
	);
}

function MediumWidget({entry}: {
	entry: WidgetEntry<EntryData>;
}) {
	const {nowPlaying} = entry;
	const {width, height} = entry.size;
	const player = getPlayerInfo(nowPlaying);
	const artworkSide = Math.round(Math.min(height - outerPadding * 2, width * 0.39));
	const contentWidth = width - artworkSide - outerPadding * 2 - columnGap;
	const titleSize = Math.min(28, height * 0.155);

	return (
		<ZStack maxSides background={player.background}>
			<HStack
				maxSides
				spacing={columnGap}
				alignment='center'
				padding={outerPadding}
				buttonStyle='borderless'
			>
				<Artwork
					url={nowPlaying.artworkURL}
					side={artworkSide}
					background={player.background}
					radius={artworkRadius}
				/>
				<VStack width={contentWidth} maxHeight alignment='leading' spacing={10}>
					<TrackText player={player} titleSize={titleSize} artistSize={12} spacing={7}/>
					<Spacer/>
					<HStack width={contentWidth} spacing={8} alignment='center'>
						<Spacer/>
						<PlayerControls player={player} spacing={8}/>
					</HStack>
				</VStack>
			</HStack>
		</ZStack>
	);
}

function LargeWidget({entry}: {
	entry: WidgetEntry<EntryData>;
}) {
	const {nowPlaying} = entry;
	const {width, height} = entry.size;
	const player = getPlayerInfo(nowPlaying);
	const artworkSide = Math.round(Math.min(width - largePadding * 2, height * 0.5));
	const contentWidth = artworkSide;
	const titleSize = Math.min(30, height * 0.084);

	return (
		<ZStack maxSides background={player.background}>
			<VStack
				maxSides
				alignment='center'
				spacing={16}
				padding={largePadding}
				buttonStyle='borderless'
			>
				<Artwork
					url={nowPlaying.artworkURL}
					side={artworkSide}
					background={player.background}
					radius={widgetRadius - largePadding}
				/>
				<TrackText player={player} width={contentWidth} titleSize={titleSize} artistSize={14} spacing={6}/>
				<Spacer/>
				<PlayerControls player={player} spacing={10} favorite/>
			</VStack>
		</ZStack>
	);
}

function getPlayerInfo(nowPlaying: AwaitNowPlayingInfo) {
	const secondary = nowPlaying.secondaryTextColor ?? 'BBAE9D';

	return {
		background: nowPlaying.backgroundColor ?? '24211F',
		primary: nowPlaying.primaryTextColor ?? 'F6EADA',
		secondary,
		tertiary: nowPlaying.tertiaryTextColor ?? secondary,
		isPlaying: nowPlaying.state === 'playing',
		isFavorite: nowPlaying.isFavorite,
		title: displayText(nowPlaying.title, 'Untitled'),
		artist: displayText(nowPlaying.artistName, 'Unknown Artist'),
		album: displayText(nowPlaying.albumTitle, 'Unknown Album').toUpperCase(),
	};
}

function TrackText({
	player,
	width,
	titleSize,
	artistSize,
	spacing,
}: {
	player: PlayerInfo;
	width?: number;
	titleSize: number;
	artistSize: number;
	spacing: number;
}) {
	const frame = width === undefined ? {} : {width};

	return (
		<VStack {...frame} alignment='leading' spacing={spacing}>
			<Text
				value={player.title}
				foreground={player.primary}
				fontSize={titleSize}
				fontWeight={900}
				lineHeight='tight'
				lineLimit={2}
				minimumScaleFactor={0.1}
			/>
			<Text
				value={player.artist}
				foreground={player.secondary}
				fontSize={artistSize}
				fontWeight={700}
				lineLimit={1}
				minimumScaleFactor={0.1}
			/>
			<Text
				value={player.album}
				foreground={player.tertiary}
				fontSize={10}
				fontWeight={600}
				lineLimit={2}
				minimumScaleFactor={0.1}
			/>
		</VStack>
	);
}

function PlayerControls({
	player,
	spacing,
	favorite = false,
}: {
	player: PlayerInfo;
	spacing: number;
	favorite?: boolean;
}) {
	return (
		<HStack spacing={spacing}>
			<ControlButton icon='backward.fill' intent={app.command('previous')} foreground={player.primary} background={player.background}/>
			<ControlButton icon={player.isPlaying ? 'pause.fill' : 'play.fill'} intent={app.command('toggle', defaultStation)} foreground={player.primary} background={player.background} primary/>
			<ControlButton icon='forward.fill' intent={app.command('next')} foreground={player.primary} background={player.background}/>
			{favorite ? <ControlButton icon={player.isFavorite ? 'heart.fill' : 'heart'} intent={app.command(player.isFavorite ? 'clearRating' : 'favorite')} foreground={player.primary} background={player.background}/> : undefined}
		</HStack>
	);
}

function Artwork({
	url,
	side,
	background,
	radius,
}: {
	url?: string;
	side: number;
	background: Color;
	radius: number;
}) {
	return (
		<ZStack sides={side} cornerRadius={radius} clipped>
			{url
				? <Image url={url} resizable aspectRatio={[1, 'fill']} interpolation='high' sides={side}/>
				: <Text value='NO COVER' foreground={background} fontSize={12} fontWeight={900} fontDesign='monospaced'/>}
		</ZStack>
	);
}

function ControlButton({
	icon,
	intent,
	foreground,
	background,
	primary = false,
}: {
	icon: string;
	intent: IntentInfo;
	foreground: Color;
	background: Color;
	primary?: boolean;
}) {
	return (
		<Button intent={intent} audio>
			<ZStack sides={controlSide} fontWeight={700} fontDesign='rounded' fontSize={14}>
				<Circle
					fill={foreground}
					opacity={primary ? 1 : 0.14}
				/>
				<Icon
					value={icon}
					foreground={primary ? background : foreground}
				/>
			</ZStack>
		</Button>
	);
}

async function command(cmd: AwaitMusicPlayerCommand, config?: AwaitMusicPlayConfig) {
	await AwaitMusic.playerCommand(cmd, config);
};

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const nowPlaying = await AwaitMusic.nowPlaying({artworkSize});

	return {
		entries: [{date: new Date(), nowPlaying}],
	};
}

const displayText = (value: string | undefined, fallback: string) => (value ?? fallback).trim().replaceAll(/\s+/g, ' ');

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		command,
	},
});
