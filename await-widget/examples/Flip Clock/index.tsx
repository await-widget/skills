import {
	Text, ZStack, Color, HStack, VFlip, Group,
} from 'await';

// @panel {type:'slider',min:0,max:4,step:1}
const flipSpacing = 3;
// @panel {type:'slider',min:1,max:96,step:1}
const fontSize = 96;
// @panel {type:'slider',min:300,max:700,step:1}
const fontWeight = 700;
// @panel {type:'color'}
const widgetBackground = '0000';
// @panel {type:'color'}
const background = '19';
// @panel {type:'color'}
const foreground = 'e5';
// @panel
const useTransparent = false;
// @panel
const use24Hour = false;

const monospacedDigit = true;

const padding = 12;
const cornerRadius = 86 / 3 - padding;

const font: Mods = {
	font: {
		name: 'Space Grotesk',
		size: fontSize,
		wght: fontWeight,
	},
	monospacedDigit,
	minimumScaleFactor: 0.1,
};

type Info = [number, number];

type PageData = {
	index: number;
	curr: NativeView;
	prev: NativeView;
	changed: boolean;
	delta: number;
};

type EntryData = {
	curr: number;
	prev: number;
	next: number;
};

type PageViewData = {
	frame: Frame;
	data: PageData;
};

function clockText(num: number) {
	return String(num).padStart(2, '0');
}

function makePage(
	info: Info,
	infoPrev: Info,
	infoNext: Info,
	delta: number,
): PageData {
	const index = info[0];
	const currNum = info[1];
	const prevNum = infoPrev[1];
	const nextNum = infoNext[1];
	const changed = currNum !== prevNum || currNum !== nextNum;
	const curr = (
		<Text
			contentTransition='identity'
			{...font}
			value={clockText(currNum)}
			padding={8}
			maxSides
			background={background}
			reverseMask={<Color value={0} height={flipSpacing} />}
			cornerRadius={cornerRadius}
		/>
	);
	const prev = (
		<Text
			contentTransition='identity'
			{...font}
			value={clockText(prevNum)}
			padding={8}
			maxSides
			background={background}
			reverseMask={<Color value={0} height={flipSpacing} />}
			cornerRadius={cornerRadius}
		/>
	);
	return {
		index,
		curr,
		prev,
		changed,
		delta,
	};
}

function getClockInfo(time: number): Info[] {
	const date = new Date(time);
	return [
		[Math.floor(time / 3_600_000), use24Hour ? date.getHours() : date.getHours() % 12 || 12],
		[Math.floor(time / 60_000), date.getMinutes()],
		[Math.floor(time / 1000), date.getSeconds()],
	];
}

function makePages({ curr, prev, next }: EntryData): PageData[] {
	const infoCurr = getClockInfo(curr);
	const infoPrev = getClockInfo(prev);
	const infoNext = getClockInfo(next);
	const delta = next > curr ? 1 : -1;
	return infoCurr.map((info, index) =>
		makePage(info, infoPrev[index]!, infoNext[index]!, delta));
}

function Page({ data, frame }: PageViewData) {
	if (data.changed) {
		return (
			<VFlip
				index={data.index}
				delta={data.delta}
				curr={data.curr}
				frame={frame}
				prev={data.prev}
				transition='identity'
			/>
		);
	}

	return (
		<ZStack frame={frame} transition='identity' id={`s-${data.index}`}>
			<ZStack
				reverseMask={<Color value={1} height={flipSpacing} />}
				cornerRadius={cornerRadius}
			>
				{data.curr}
			</ZStack>
		</ZStack>
	);
}

function widget(entry: WidgetEntry<EntryData>) {
	const {
		size: { width, height },
		renderingMode,
	} = entry;
	const w_total = Math.floor(width / 2 - padding) * 2;
	const pageSpacing = 6;
	const w = (w_total - pageSpacing) / 2;
	let h = Math.min(w, height - padding * 2);
	h = Math.floor(h / 2) * 2;
	const frame = { width: w, height: h };
	const rawPages = makePages(entry);
	const content = (
		<HStack
			spacing={pageSpacing}
			animation={{ type: 'smooth', duration: 0.6 }}
			textAlignment='center'
			foreground={foreground}
			pixelPerfectCenter
			padding={{ horizontal: padding }}
			maxSides
			background={widgetBackground}
		>
			<Page data={rawPages[0]!} frame={frame} />
			<Page data={rawPages[1]!} frame={frame} />
		</HStack>
	);
	if (renderingMode === 'fullColor' && useTransparent) {
		return <Group compositingGroup luminanceToAlpha colorInvert>{content}</Group>;
	}
	return content;
}

function widgetTimeline() {
	const baseDate = new Date();
	baseDate.setSeconds(0, 0);
	const time = baseDate.getTime();
	const entries = Array.from({ length: 16 }, (_, i) => {
		const t = time + 1000 * 60 * i;
		return {
			date: new Date(t - 500),
			curr: t,
			prev: t - 1000 * 60,
			next: t + 1000 * 60,
		};
	});

	return { entries, update: 'rapid' as const };
}

Await.define({
	widget,
	widgetTimeline,
});
