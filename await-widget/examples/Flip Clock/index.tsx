import {
	Text,
	Time,
	ZStack,
	Color,
	HStack,
	VFlip,
	Group,
	FullButton,
} from 'await';

// @panel {type:'slider',min:0,max:4,step:1,title:'Page Spacing',title_zh:'页片间距'}
const flipSpacing = 4;
// @panel {type:'slider',min:1,max:150,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 100;
// @panel {type:'slider',min:300,max:700,step:1,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 700;
// @panel {type:'color',title:'Background',title_zh:'背景'}
const widgetBackground = '0000';
// @panel {type:'color',title:'Page',title_zh:'页片'}
const background = '19';
// @panel {type:'color',title:'Foreground',title_zh:'前景'}
const foreground = 'e5';
// @panel {title:'Use Transparent',title_zh:'启用透明'}
const useTransparent = false;
// @panel {title:'24 Hour',title_zh:'24 小时制'}
const use24Hour = false;
// @panel {title:'Open Clock',title_zh:'打开时钟'}
const openClock = true;

const monospacedDigit = true;

const padding = 12;
const cornerRadius = 86 / 3 - padding;

const font: Mods = {
	font: {
		name: 'Space Grotesk', size: fontSize, wght: fontWeight,
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
	size: Size;
	data: PageData;
};

function clockText(num: number) {
	return String(num).padStart(2, '0');
}

function pageContent(num: number, size: Size, showSeconds: boolean) {
	return (
		<ZStack background={background}
			reverseMask={<Color value={0} height={flipSpacing} />}
			cornerRadius={cornerRadius}
			overlay={showSeconds
				? {
					alignment: 'bottomTrailing',
					content: (
						<Time
							format={[{field: 'second', style: 'twoDigits'}]}
							font={{name: 'Space Grotesk', size: 14, wght: fontWeight}}
							monospacedDigit
							foreground={foreground}
							contentTransition='identity'
							padding={{right: 12, bottom: 8}}
							textAlignment='trailing'
						/>
					),
				}
				: undefined}>
			<Text
				contentTransition='identity'
				{...font}
				value={clockText(num)}
				padding={8}
				frame={size}
				foreground={foreground}
			/>
		</ZStack>
	);
}

// eslint-disable-next-line max-params
function makePage(
	info: Info,
	infoPrev: Info,
	infoNext: Info,
	delta: number,
	size: Size,
	showSeconds: boolean,
): PageData {
	const index = info[0];
	const currNum = info[1];
	const prevNum = infoPrev[1];
	const nextNum = infoNext[1];
	const changed = currNum !== prevNum || currNum !== nextNum;
	const curr = pageContent(currNum, size, showSeconds);
	const prev = pageContent(prevNum, size, showSeconds);
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
	const hour = date.getHours();
	const hour12 = hour % 12;
	return [
		[Math.floor(time / 3_600_000), use24Hour ? hour : (hour12 === 0 ? 12 : hour12)],
		[Math.floor(time / 60_000), date.getMinutes()],
		[Math.floor(time / 1000), date.getSeconds()],
	];
}

function makePages({curr, prev, next}: EntryData, size: Size): PageData[] {
	const infoCurr = getClockInfo(curr);
	const infoPrev = getClockInfo(prev);
	const infoNext = getClockInfo(next);
	const delta = next > curr ? 1 : -1;
	return infoCurr.map((info, index) =>
		makePage(info, infoPrev[index], infoNext[index], delta, size, index === 1));
}

function Page({data, size}: PageViewData) {
	if (data.changed) {
		return (
			<VFlip
				index={data.index}
				delta={data.delta}
				curr={data.curr}
				frame={size}
				prev={data.prev}
				transition='identity'
			/>
		);
	}

	return (
		<ZStack frame={size} transition='identity' id={`s-${data.index}`}>
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
		size: {width, height},
		renderingMode,
	} = entry;
	const w_total = Math.floor(width / 2 - padding) * 2;
	const pageSpacing = 12;
	const w = (w_total - pageSpacing) / 2;
	let h = Math.min(w, height - padding * 2);
	h = Math.floor(h / 2) * 2;
	const size = {width: w, height: h};
	const rawPages = makePages(entry, size);
	const x = rawPages[0];
	const content = (
		<HStack
			spacing={pageSpacing}
			animation={{type: 'smooth', duration: 0.6}}
			textAlignment='center'
			pixelPerfectCenter
			padding={{horizontal: padding}}
			maxSides
			background={widgetBackground}
			overlay={<FullButton intent={app.tap()}/>}
		>
			<Page data={rawPages[0]} size={size} />
			<Page data={rawPages[1]} size={size} />
		</HStack>
	);
	if (renderingMode === 'fullColor' && useTransparent) {
		return <Group compositingGroup luminanceToAlpha colorInvert>{content}</Group>;
	}

	return content;
}

function widgetTimeline(): Timeline<EntryData> {
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

	return {entries, update: 'rapid'};
}

function tap() {
	if (openClock) {
		AwaitLaunch.start('com.apple.mobiletimer');
	}
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetFamilies: ['medium'],
	widgetIntents: {tap},
});
