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

const artworkSize = 256;
const defaultStation: AwaitMediaPlayConfig = {source: 'station', type: 'user'};
const outerPadding = 16;
const columnGap = 18;
const widgetRadius = 86 / 3;
const artworkRadius = widgetRadius - outerPadding;
const smallPadding = 10;
const largePadding = 16;

type EntryData = {
	nowPlaying: AwaitNowPlayingInfo;
};

function widget(entry: WidgetEntry<EntryData>) {
	if (entry.family === 'small') {
		return <SmallWidget entry={entry}/>;
	}

	if (entry.family === 'large' || entry.family === 'extraLarge' || entry.family === 'extraLargePortrait') {
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
	const background = nowPlaying.backgroundColor ?? '24211F';
	const primary = nowPlaying.primaryTextColor ?? 'F6EADA';
	const secondary = nowPlaying.secondaryTextColor ?? 'BBAE9D';
	const tertiary = nowPlaying.tertiaryTextColor ?? secondary;
	const isPlaying = nowPlaying.state === 'playing';
	const artworkSide = Math.round(Math.min(height - outerPadding * 2, width * 0.39));
	const contentWidth = width - artworkSide - outerPadding * 2 - columnGap;
	const titleSize = Math.min(28, height * 0.155);
	const title = displayText(nowPlaying.title, 'Untitled');
	const artist = displayText(nowPlaying.artistName, 'Unknown Artist');
	const album = displayText(nowPlaying.albumTitle, 'Await Media');

	return (
		<ZStack maxSides background={background}>
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
					background={background}
					radius={artworkRadius}
				/>
				<VStack width={contentWidth} maxHeight alignment='leading' spacing={10}>
					<VStack alignment='leading' spacing={7}>
						<Text
							value={title}
							foreground={primary}
							fontSize={titleSize}
							fontWeight={900}
							lineHeight='tight'
							lineLimit={2}
							minimumScaleFactor={0.62}
						/>
						<Text
							value={artist}
							foreground={secondary}
							fontSize={12}
							fontWeight={700}
							lineLimit={1}
							minimumScaleFactor={0.7}
						/>
						<Text
							value={album.toUpperCase()}
							foreground={tertiary}
							fontSize={10}
							fontWeight={600}
							lineLimit={1}
							minimumScaleFactor={0.65}
						/>
					</VStack>
					<Spacer/>
					<HStack width={contentWidth} spacing={8} alignment='center'>
						<Spacer/>
						<HStack spacing={7}>
							<ControlButton icon='backward.fill' intent={app.command('previous')} foreground={primary} background={background}/>
							<ControlButton icon={isPlaying ? 'pause.fill' : 'play.fill'} intent={app.command('toggle', defaultStation)} foreground={primary} background={background} primary/>
							<ControlButton icon='forward.fill' intent={app.command('next')} foreground={primary} background={background}/>
						</HStack>
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
	const background = nowPlaying.backgroundColor ?? '24211F';
	const primary = nowPlaying.primaryTextColor ?? 'F6EADA';
	const secondary = nowPlaying.secondaryTextColor ?? 'BBAE9D';
	const tertiary = nowPlaying.tertiaryTextColor ?? secondary;
	const isPlaying = nowPlaying.state === 'playing';
	const artworkSide = Math.round(Math.min(width - largePadding * 2, height * 0.5));
	const contentWidth = artworkSide;
	const titleSize = Math.min(30, height * 0.084);
	const title = displayText(nowPlaying.title, 'Untitled');
	const artist = displayText(nowPlaying.artistName, 'Unknown Artist');
	const album = displayText(nowPlaying.albumTitle, 'Await Media');

	return (
		<ZStack maxSides background={background}>
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
					background={background}
					radius={widgetRadius - largePadding}
				/>
				<VStack width={contentWidth} alignment='leading' spacing={6}>
					<Text
						value={title}
						foreground={primary}
						fontSize={titleSize}
						fontWeight={900}
						lineHeight='tight'
						lineLimit={1}
						minimumScaleFactor={0.6}
					/>
					<Text
						value={artist}
						foreground={secondary}
						fontSize={14}
						fontWeight={700}
						lineLimit={1}
						minimumScaleFactor={0.7}
					/>
					<Text
						value={album.toUpperCase()}
						foreground={tertiary}
						fontSize={10}
						fontWeight={600}
						lineLimit={1}
						minimumScaleFactor={0.65}
					/>
				</VStack>
				<Spacer/>
				<HStack spacing={10}>
					<ControlButton icon='backward.fill' intent={app.command('previous')} foreground={primary} background={background}/>
					<ControlButton icon={isPlaying ? 'pause.fill' : 'play.fill'} intent={app.command('toggle', defaultStation)} foreground={primary} background={background} primary/>
					<ControlButton icon='forward.fill' intent={app.command('next')} foreground={primary} background={background}/>
				</HStack>
			</VStack>
		</ZStack>
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
	const side = 40;

	return (
		<Button intent={intent} audio>
			<ZStack sides={side}>
				<Circle
					fill={foreground}
					opacity={primary ? 1 : 0.14}
				/>
				<Icon
					value={icon}
					fontSize={14}
					foreground={primary ? background : foreground}
				/>
			</ZStack>
		</Button>
	);
}

async function command(cmd: AwaitMusicPlayerCommand, config?: AwaitMediaPlayConfig) {
	await AwaitMedia.mediaPlayerCommand(cmd, config);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const nowPlaying = await AwaitMedia.nowPlayingMedia({artworkSize});

	return {
		entries: [{date: new Date(), nowPlaying}],
	};
}

function displayText(value: string | undefined, fallback: string): string {
	return compactWhitespace(value ?? fallback);
}

function compactWhitespace(value: string): string {
	return value.trim().replaceAll(/\s+/g, ' ');
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		command,
	},
});
