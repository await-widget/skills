import {
	Color,
	HStack,
	Text,
	VFlip,
	ZStack,
} from 'await';

const background = 0.1;
const foreground = 0.6;

const font: Mods = {
	font: {
		name: 'SF Adaptive Soft Numeric',
		size: 72,
		wght: 900,
		SOFT: 0,
		monospacedDigit: true,
	},
	minimumScaleFactor: 0.1,
};

type Info = [number, number];

type PageData = {
	index: number;
	curr: NativeView;
	prev: NativeView;
	changed: boolean;
	delta: number; // 1 正向 -1 负向
};

type EntryData = {
	curr: number;
	prev: number;
	next: number;
};

type PageViewData = {
	frame: Frame;
	cornerRadius: number;
	data: PageData;
};

function makePage(info: Info, infoPrev: Info, infoNext: Info, delta: number): PageData {
	const index = info[0];
	const currNum = info[1];
	const prevNum = infoPrev[1];
	const nextNum = infoNext[1];
	const changed = currNum !== prevNum || currNum !== nextNum;
	const curr = <Text contentTransition='identity' {...font} value={String(currNum).padStart(2, '0')} padding={8} maxSides background={background} reverseMask={<Color value={0} height={2}/>}/>;
	const prev = <Text contentTransition='identity' {...font} value={String(prevNum).padStart(2, '0')} padding={8} maxSides background={background} reverseMask={<Color value={0} height={2}/>}/>;
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

const padding = 12;

function Page({data, frame, cornerRadius}: PageViewData) {
	if (data.changed) {
		return (
			<VFlip
				index={data.index}
				delta={data.delta}
				cornerRadius={cornerRadius}
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
	const spacing = 4;
	const w = (w_total - spacing) / 2;
	const h = Math.floor(height / 2 - padding * 3) * 2;
	const frame = {width: w, height: h};
	const rawPages = makePages(entry);
	const cornerRadius = 86 / 3 - padding;
	return (
		<HStack
			spacing={spacing}
			animation={{type: 'smooth', duration: 0.6}}
			textAlignment='center'
			foreground={foreground}
			pixelPerfectCenter
		>
			<Page data={rawPages[0]!} frame={frame} cornerRadius={cornerRadius}/>
			<Page data={rawPages[1]!} frame={frame} cornerRadius={cornerRadius}/>
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
