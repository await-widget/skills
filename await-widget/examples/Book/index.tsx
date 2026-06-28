import {
	FullButton, HFlip, HStack, Text, ZStack, Color, Group,
} from 'await';

// @panel
const bookPath = 'sample.txt';
// @panel {type:'slider',min:0,max:1,step:0.05}
const background = 0.1;
// @panel {type:'slider',min:0,max:1,step:0.05}
const foreground = 0.9;
// @panel {type:'slider',min:1,max:3,step:0.1}
const fontSizeFactor = 3;
// @panel {type:'slider',min:100,max:800,step:100}
const fontWeight = 600;
// @panel
const withPadding = true;
// @panel
const useTransparent = false;

const animation: NativeAnimation = {duration: 0.6, type: 'smooth'};
const pagePadding = {top: 16, horizontal: 16, bottom: 24};
const padding = withPadding ? 12 : 0;
const font: Mods = {
	fontSize: 32,
	fontWeight,
	minimumScaleFactor: 1 / 32,
};
const fontSmall: Mods = {
	fontDesign: 'monospaced',
	fontSize: 10,
	fontWeight: 600,
	monospacedDigit: true,
};

type EntryData = {
	dataIndex: number;
	delta: number;
	pageSize: number;
	bookSize: number;
	pageFrame: Size;
	offset: number;
	page: Page;
};

type RawPageData = {
	bookSize: number;
	dataIndex: number;
	delta: number;
	pageSize: number;
};

type Page = {
	backPageIndex: number;
	cornerRadius: number;
	currContent: NativeView;
	pageIndex: number;
	prevContent: NativeView;
	delta: number;
};

function pageContent(index: number, text: string, backPageIndex: number) {
	return (index <= 0 || index >= backPageIndex)
		? <Color value={background}/>
		: (
			<Color
				value={background}
				overlay={<Text foreground={foreground} {...font} value={text} padding={pagePadding}/>}
				overlay_={{
					alignment: 'bottomTrailing',
					content: <Text value={`${index}/${backPageIndex - 1}`} {...fontSmall} foreground={[foreground, 0.5]} padding={10}/>,
				}}
			/>
		);
}

function makePage(data: RawPageData): Page {
	const {bookSize, pageSize, dataIndex, delta} = data;
	const backPageIndex = Math.ceil(bookSize / pageSize) + 1;
	const pageIndex = dataIndex === bookSize + 1 ? backPageIndex : Math.ceil(dataIndex / pageSize);
	const prevIndex = pageIndex - delta;
	const texts = AwaitFile.readTextByPages(bookPath, [pageIndex - 1, pageIndex - delta - 1], pageSize).map(v => v?.trim().replaceAll(/[\n\r]{3,}/g, '\n\n') ?? '');
	return {
		backPageIndex,
		cornerRadius: 86 / 3 - padding,
		currContent: pageContent(pageIndex, texts[0]!, backPageIndex),
		pageIndex,
		prevContent: pageContent(prevIndex, texts[1]!, backPageIndex),
		delta,
	};
}

function Book({page}: {page: Page}) {
	const {currContent, prevContent, cornerRadius, backPageIndex, delta, pageIndex} = page;
	const topFlag = delta === -1 && pageIndex >= backPageIndex - 1 || delta === 1 && pageIndex >= backPageIndex;
	const bottomFlag = delta === 1 && pageIndex <= 1 || delta === -1 && pageIndex <= 0;
	return (
		<HFlip
			index={pageIndex}
			delta={delta}
			curr={<ZStack cornerRadius={cornerRadius}>{currContent}</ZStack>}
			leadingHidden={bottomFlag}
			prev={<ZStack cornerRadius={cornerRadius}>{prevContent}</ZStack>}
			trailingHidden={topFlag}
		/>
	);
}

function widget(entry: WidgetEntry<EntryData>) {
	const {pageSize, bookSize, offset, pageFrame, page, renderingMode} = entry;
	const content = (
		<ZStack
			geometryGroup
			pixelPerfectCenter={{x: offset}}
			animation={animation}
			frame={pageFrame}
		>
			<Book page={page}/>
			<HStack>
				<FullButton intent={app.change(pageSize, bookSize, -1)}/>
				<FullButton intent={app.change(pageSize, bookSize, 1)}/>
			</HStack>
		</ZStack>
	);
	if (renderingMode === 'fullColor' && useTransparent) {
		return <Group compositingGroup luminanceToAlpha colorInvert>{content}</Group>;
	}
	return content;
}

function change(pageSize: number, bookSize: number, diff: number) {
	const dataIndex = AwaitStore.num('dataIndex');
	if (diff > 0 && dataIndex === bookSize + 1) {
		return;
	}

	if (diff < 0 && dataIndex === 0) {
		return;
	}

	if (dataIndex === bookSize && diff > 0) {
		AwaitStore.set('dataIndex', bookSize + 1);
	} else if (dataIndex === bookSize + 1 && diff < 0) {
		AwaitStore.set('dataIndex', bookSize);
	} else if (dataIndex === 0 && diff > 0) {
		AwaitStore.set('dataIndex', 1);
	} else if (dataIndex === 1 && diff < 0) {
		AwaitStore.set('dataIndex', 0);
	} else {
		AwaitStore.set('dataIndex', Math.max(0, Math.min(bookSize + 1, dataIndex + diff * pageSize)));
	}

	AwaitStore.set('delta', diff > 0 ? 1 : -1);
}

function widgetTimeline(context: TimelineContext): Timeline<EntryData> {
	const {width, height} = context.size;
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
	const bookSize = AwaitFile.fileSize(bookPath) ?? 0;
	const pageSize = Math.floor((pageWidth - pagePadding.horizontal) * (pageHeight - pagePadding.bottom - pagePadding.top) / fontSizeFactor / 100);
	const dataIndex = AwaitStore.num('dataIndex');
	const delta = AwaitStore.num('delta', -1);
	const page = makePage({
		bookSize, dataIndex, delta, pageSize,
	});
	const {pageIndex, backPageIndex} = page;
	const offset = pageIndex <= 0 ? -pageWidth / 4 : (pageIndex >= backPageIndex ? pageWidth / 4 : 0);
	const entries = [{
		date: new Date(), dataIndex, delta, bookSize, pageSize, pageFrame, offset, page,
	}];
	return {entries};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {change},
});
