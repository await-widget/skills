import {
	Button,
	Circle,
	Color,
	HStack,
	Icon,
	Image,
	Modifier,
	Spacer,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel {title:'Query',title_zh:'关键词'}
const query = '';
// @panel {type:'slider',min:1,max:50,step:1,title:'Query Limit',title_zh:'查询数量'}
const limit = 25;
// @panel {type:'menu',items:['song','album','artist','station','playlist'],title:'Mode',title_zh:'模式'}
const source = 'station';
// @panel {type:'menu',items:['user','discovery','song','artist'],title:'Submode',title_zh:'子模式'}
const type = 'user';
// @panel {title:'Show Favorite',title_zh:'显示收藏'}
const showFavorite = false;
// @panel {title:'Use Transparent',title_zh:'启用透明'}
const useTransparent = false;

const artworkSize = 400;
const musicConfig: AwaitMusicPlayConfig = {
	// @ts-expect-error limit is OK
	source, query, type, limit,
};
const outerPadding = 16;
const columnGap = 16;
const widgetRadius = 86 / 3;
const artworkRadius = widgetRadius - outerPadding;
const smallPadding = 12;
const controlSide = 40;

type EntryData = {nowPlaying: AwaitNowPlayingInfo};
type PlayerInfo = ReturnType<typeof getPlayerInfo>;

const buttonStyle: CustomButtonStyle = {normal: <Modifier/>, press: <Modifier/>};

function widget(entry: WidgetEntry<EntryData>) {
	const url = entry.nowPlaying.id === undefined ? 'music://music.apple.com' : `music://music.apple.com/us/song/${entry.nowPlaying.id}`;
	const content = entry.family === 'small'
		? <SmallWidget entry={entry}/>
		: <MediumWidget entry={entry}/>;
	return (
		<Button buttonStyle={buttonStyle} url={url}>{content}</Button>
	);
}

function SmallWidget({entry}: {
	entry: WidgetEntry<EntryData>;
}) {
	const {nowPlaying} = entry;
	const isTrans = useTransparent || entry.renderingMode !== 'fullColor';
	const player = getPlayerInfo(nowPlaying, isTrans);
	const {height} = entry.size;
	const artworkSide = Math.round((height - smallPadding * 2) * 0.5);
	const titleSize = 12;

	return (
		<ZStack maxSides background={player.background}>
			<VStack alignment='leading' maxSides padding={smallPadding} spacing={0} buttonStyle='borderless'>
				<HStack frame={{maxWidth: 'max', alignment: 'top'}} alignment='top'>
					<Artwork
						url={nowPlaying.artworkURL}
						side={artworkSide}
						radius={widgetRadius - smallPadding}
					/>
					<Spacer/>
					{showFavorite
						? <ControlButton
							icon={player.isFavorite ? 'heart.fill' : 'heart'}
							intent={app.command(player.isFavorite ? 'clearRating' : 'favorite')}
							foreground={player.primary}
							background={player.background}
						/>
						: undefined}
				</HStack>
				<Spacer height={8}/>
				<Text
					value={player.title}
					frame={{maxWidth: 'max', alignment: 'leading'}}
					foreground={player.primary}
					fontSize={titleSize}
					fontWeight={700}
					lineLimit={1}
					minimumScaleFactor={1 / titleSize}
				/>
				<Spacer minLength={8}/>
				<PlayerControls player={player} showsFavorite={false} spread/>
			</VStack>
		</ZStack>
	);
}

function MediumWidget({entry}: {
	entry: WidgetEntry<EntryData>;
}) {
	const {nowPlaying} = entry;
	const {height} = entry.size;
	const isTrans = useTransparent || entry.renderingMode !== 'fullColor';
	const player = getPlayerInfo(nowPlaying, isTrans);
	const artworkSide = Math.min(height - outerPadding * 2);
	const titleSize = Math.min(28, height * 0.15);

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
					radius={artworkRadius}
				/>
				<VStack frame={{maxWidth: 'max', maxHeight: 'max', alignment: 'leading'}} alignment='leading' spacing={10}>
					<TrackText player={player} titleSize={titleSize} artistSize={12} spacing={6}/>
					<Spacer/>
					<PlayerControls player={player}/>
				</VStack>
			</HStack>
		</ZStack>
	);
}

function getPlayerInfo(nowPlaying: AwaitNowPlayingInfo, isTrans: boolean) {
	const	background: Color = isTrans ? '' : nowPlaying.backgroundColor ?? '9';
	const primary: Color = isTrans ? [1, 1] : nowPlaying.primaryTextColor ?? 1;
	const secondary: Color = isTrans ? [1, 0.75] : nowPlaying.secondaryTextColor ?? primary;
	const tertiary: Color = isTrans ? [1, 0.5] : nowPlaying.tertiaryTextColor ?? secondary;
	return {
		background,
		primary,
		secondary,
		tertiary,
		isPlaying: nowPlaying.state === 'playing',
		isFavorite: nowPlaying.isFavorite,
		title: displayText(nowPlaying.title, 'Song'),
		artist: displayText(nowPlaying.artistName, 'Artist'),
		album: displayText(nowPlaying.albumTitle, 'Album').toUpperCase(),
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
	showsFavorite = showFavorite,
	spread = false,
}: {
	player: PlayerInfo;
	showsFavorite?: boolean;
	spread?: boolean;
}) {
	const previous = <ControlButton icon='backward.fill' intent={app.command('previous')} foreground={player.primary} background={player.background}/>;
	const toggle = <ControlButton icon={player.isPlaying ? 'pause.fill' : 'play.fill'} intent={app.command('toggle', musicConfig)} foreground={player.primary} background={player.background}/>;
	const next = <ControlButton icon='forward.fill' intent={app.command('next')} foreground={player.primary} background={player.background}/>;
	const favorite = <ControlButton icon={player.isFavorite ? 'heart.fill' : 'heart'} intent={app.command(player.isFavorite ? 'clearRating' : 'favorite')} foreground={player.primary} background={player.background}/>;
	const spacer = <Spacer/>;
	const margin = <Spacer width={8}/>;
	const controls = showsFavorite
		? [previous, spacer, toggle, spacer, next, spacer, favorite]
		: (spread
			? [previous, spacer, toggle, spacer, next]
			: [spacer, previous, margin, toggle, margin, next]);

	return (
		<HStack frame={{maxWidth: 'max', alignment: 'trailing'}}>
			{controls}
		</HStack>
	);
}

function Artwork({
	url,
	side,
	radius,
}: {
	url?: string;
	side: number;
	radius: number;
}) {
	return (
		<ZStack sides={side} cornerRadius={radius} clipped>
			{url === undefined
				? <Color value={[1, 0.15]}/>
				: <Image accented='fullColor' url={url} resizable aspectRatio='fill' sides={side} clipped/>}
		</ZStack>
	);
}

function ControlButton({
	icon,
	intent,
	foreground,
}: {
	icon: string;
	intent: IntentInfo;
	foreground: Color;
	background: Color;
}) {
	return (
		<Button intent={intent} audio>
			<ZStack sides={controlSide} fontWeight={700} fontDesign='rounded' fontSize={14}>
				<Circle
					fill={foreground}
					opacity={0.15}
					overlay={<Icon
						value={icon}
						foreground={foreground}
					/>}
				/>
			</ZStack>
		</Button>
	);
}

async function command(cmd: AwaitMusicPlayerCommand, config?: AwaitMusicPlayConfig) {
	await AwaitMusic.playerCommand(cmd, config);
}

// @panel {title:'Restart',title_zh:'重启'}
async function restart() {
	await AwaitMusic.playerCommand('start', musicConfig);
}

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
		command, restart,
	},
	widgetFamilies: ['small', 'medium'],
	autoAccented: false,
});
