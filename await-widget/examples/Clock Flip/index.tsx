import {
	Color,
	HStack,
	Spacer,
	Text,
	VFlip,
	ZStack,
} from 'await';

// @panel {type:'color'}
const widgetBackground = 0;
// @panel {type:'color'}
const foreground = 0.8;
// @panel {type:'color'}
const background = 0.1;
// @panel
const showBackground = false;
const padding = 10;
const cornerRadius = 86 / 3 - padding;

const font: Mods = {
	// font: {
	// 	name: 'SF Adaptive Soft Numeric',
	// 	size: 90,
	// 	wght: 800,
	// 	wdth: 80,
	// 	SOFT: 40,
	// 	monospacedDigit: true,
	// },
	fontSize: 90,
	fontWeight: 800,
	fontWidth: 80,
	fontDesign: 'monospaced',
	monospacedDigit: true,
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

function makePage(info: Info, infoPrev: Info, infoNext: Info, delta: number): PageData {
	const index = info[0];
	const currNum = info[1];
	const prevNum = infoPrev[1];
	const nextNum = infoNext[1];
	const changed = currNum !== prevNum || currNum !== nextNum;
	const curr = <Text contentTransition='identity' {...font} value={String(currNum).padStart(2, '0')} padding={8} maxSides background={background} reverseMask={<Color value={0} height={2}/>} cornerRadius={cornerRadius}/>;
	const prev = <Text contentTransition='identity' {...font} value={String(prevNum).padStart(2, '0')} padding={8} maxSides background={background} reverseMask={<Color value={0} height={2}/>} cornerRadius={cornerRadius}/>;
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
		[Math.floor(time / 3_600_000), date.getHours() % 12 || 12],
		[Math.floor(time / 60_000), date.getMinutes()],
		[Math.floor(time / 1000), date.getSeconds()],
	];
}

function makePages({curr, prev, next}: EntryData): PageData[] {
	const infoCurr = getClockInfo(curr);
	const infoPrev = getClockInfo(prev);
	const infoNext = getClockInfo(next);
	const delta = next > curr ? 1 : -1;
	return infoCurr.map((info, index) => makePage(info, infoPrev[index]!, infoNext[index]!, delta));
}

function Page({data, frame}: PageViewData) {
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
		<ZStack
			frame={frame}
			transition='identity'
			id={`s-${data.index}`}
		>
			<ZStack reverseMask={<Color value={1} height={2}/>} cornerRadius={cornerRadius}>
				{data.curr}
			</ZStack>
		</ZStack>
	);
}

function widget(entry: WidgetEntry<EntryData>) {
	const {size: {width, height}} = entry;
	const w_total = Math.floor(width / 2 - padding) * 2;
	const spacing = 10;
	const h = Math.floor(height / 2 - padding) * 2;
	const w = (w_total - spacing) / 2;
	const frame = {width: w, height: h};
	const rawPages = makePages(entry);
	return (
		<HStack
			spacing={spacing}
			animation={{type: 'smooth', duration: 0.6}}
			textAlignment='center'
			foreground={foreground}
			pixelPerfectCenter
			padding={{horizontal: padding}}
			maxSides
			background={showBackground ? widgetBackground : undefined}
		>
			<Page data={rawPages[0]!} frame={frame}/>
			<Page data={rawPages[1]!} frame={frame}/>
		</HStack>
	);
}

function widgetTimeline() {
	const baseDate = new Date();
	baseDate.setSeconds(0, 0);
	const time = baseDate.getTime();
	const entries = Array.from({length: 16}, (_, i) => {
		const t = time + 1000 * 60 * i;
		return {
			date: new Date(t - 500),
			curr: t,
			prev: t - 1000 * 60,
			next: t + 1000 * 60,
		};
	});

	return {entries, update: 'rapid' as const};
}

Await.define({
	widget,
	widgetTimeline,
});
