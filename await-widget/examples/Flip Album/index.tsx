import {
	FullButton,
	HFlip,
	HStack,
	ZStack,
	Image,
	Color,
} from 'await';

// @panel {type:'menu',items:[30,60,90,120],title:'自动刷新分钟'}
const changeTime = 60;

const animation: NativeAnimation = {duration: 0.6, type: 'smooth'};
const withPadding = false;
const padding = 12;

type EntryData = {
	pageIndex: number;
	delta: number;
	page: Page;
	pageFrame: Size;
};

type RawPageData = {
	pageIndex: number;
	delta: number;
};

type Page = {
	cornerRadius: number;
	currContent: NativeView;
	pageIndex: number;
	prevContent: NativeView;
	delta: number;
};

function pageContent(image: string) {
	return <Color overlay={<Image url={image} resizable aspectRatio='fill'/>}/>;
}

function makePage(data: RawPageData): Page {
	const {pageIndex, delta} = data;
	const prevIndex = pageIndex - delta;
	const files = [...AwaitFile.files('images')].toSorted((a, b) =>
		a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base',
		}));
	const count = files.length;
	const a = files[((pageIndex % count) + count) % count];
	const b = files[((prevIndex % count) + count) % count];
	const images = [`images/${a}`, `images/${b}`];
	return {
		cornerRadius: 86 / 3 - (withPadding ? padding : 0),
		currContent: pageContent(images[0]),
		pageIndex,
		prevContent: pageContent(images[1]),
		delta,
	};
}

function Book({page, pageFrame}: {page: Page; pageFrame: Size}) {
	const {currContent, prevContent, cornerRadius, delta, pageIndex} = page;
	return (
		<HFlip
			index={pageIndex}
			delta={delta}
			curr={<ZStack cornerRadius={cornerRadius}>{currContent}</ZStack>}
			prev={<ZStack cornerRadius={cornerRadius}>{prevContent}</ZStack>}
			frame={pageFrame}
		/>
	);
}

function widget({page, pageFrame}: WidgetEntry<EntryData>) {
	return (
		<ZStack pixelPerfectCenter animation={animation}>
			<Book page={page} pageFrame={pageFrame}/>
			<HStack>
				<FullButton intent={app.change(-1)}/>
				<FullButton intent={app.change(1)}/>
			</HStack>
		</ZStack>
	);
}

function change(diff: number) {
	const pageIndex = AwaitStore.num('pageIndex');
	AwaitStore.set('pageIndex', pageIndex + diff);
	AwaitStore.set('delta', diff > 0 ? 1 : -1);
	AwaitStore.set('ttl', Date.now());
}

function widgetTimeline({size}: TimelineContext) {
	const {width, height} = size;
	let pageWidth = Math.ceil(width / 2) * 2;
	let pageHeight = height;
	if (withPadding) {
		pageWidth = Math.floor(width / 2 - padding) * 2;
		pageHeight -= padding * 2;
	}

	const pageFrame = {
		width: pageWidth,
		height: pageHeight,
	};
	let pageIndex = AwaitStore.num('pageIndex');
	let delta = AwaitStore.num('delta', -1);
	if (Date.now() - AwaitStore.num('ttl') > 500) {
		pageIndex += 1;
		delta = 1;
		AwaitStore.set('pageIndex', pageIndex);
		AwaitStore.set('delta', delta);
		AwaitStore.set('ttl', Date.now());
	}

	const page = makePage({pageIndex, delta});
	const entries = [{
		date: new Date(), pageIndex, delta, page, pageFrame,
		update: new Date(Date.now() + changeTime * 60 * 1000),
	}];
	return {entries};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {change},
	widgetFamilies: ['small', 'medium', 'large', 'extraLarge', 'extraLargePortrait'],
});
