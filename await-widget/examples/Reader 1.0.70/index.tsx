import {
	FullButton,
	HFlip,
	HStack,
	Text,
	TextRender,
	ZStack,
	Color,
} from 'await';

// @panel {title:'Book Path',title_zh:'书籍路径'}
const bookPath = 'sample.txt';
// @panel {type:'slider',min:0,max:1,step:0.05,title:'Background',title_zh:'背景'}
const background = 0;
// @panel {type:'slider',min:0,max:1,step:0.05,title:'Foreground',title_zh:'前景'}
const foreground = 0.9;
// @panel {type:'slider',min:10,max:32,step:1,title:'Font Size',title_zh:'字号'}
const fontSize = 20;
// @panel {type:'slider',min:0,max:24,step:1,title:'Line Spacing',title_zh:'行间距'}
const lineSpacing = 0;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 700;
// @panel {type:'menu',items:['default','serif','rounded','monospaced'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'serif';
// @panel {title:'Font URL',title_zh:'字体文件路径'}
const fontURL = '';
// @panel {type:'slider',title:'Padding',min:0,max:16,step:1,title_zh:'边距'}
const padding = 0;
// @panel {type:'slider',title:'Page Padding',min:0,max:24,step:1,title_zh:'页边距'}
const pagePadding = 24;
// @panel {type:'slider',min:0,max:3,step:1,title:'Progress Places',title_zh:'进度位数'}
const progressDecimalPlaces = 1;
// @panel {title:'Use Transparent',title_zh:'启用透明'}
const useTransparent = false;

const animation: NativeAnimation = {duration: 0.6, type: 'smooth'};
const cornerRadius = 86 / 3 - padding;
const fontSmall: Mods = {
	fontDesign: 'monospaced',
	fontSize: 9,
	fontWeight: 700,
	monospacedDigit: true,
};

type PageContent = Pick<TextRenderResult, 'text' | 'lines' | 'startOffset' | 'endOffset' | 'totalBytes'>;
type Page = PageContent | 'front' | 'back';

type StoredPage = {
	request: TextRenderRequest;
	content?: Page;
};

type ReaderState = {
	current: StoredPage;
	previous?: StoredPage;
	layout?: TextRenderLayout;
	forward: boolean;
	flipIndex: number;
};

type EntryData = {
	forward: boolean;
	flipIndex: number;
	pageFrame: Size;
	layout: TextRenderLayout;
	current: Page;
	previous: Page | undefined;
};

function pageContent(page: Page, size: Size, layout: TextRenderLayout) {
	if (typeof page === 'string' || page.startOffset === page.endOffset) {
		return <Color value={background} cornerRadius={cornerRadius} />;
	}

	const progress = ((page.endOffset / page.totalBytes) * 100).toFixed(progressDecimalPlaces);
	return (
		<Color
			value={background}
			overlay={
				<ZStack
					padding={pagePadding}
					frame={size}
				>
					<TextRender
						value={{...layout, ...page}}
						fill={foreground}
					/>
				</ZStack>
			}
			overlay_={{
				alignment: 'bottomTrailing',
				content: (
					<HStack spacing={2} {...fontSmall} foreground={[foreground, 0.5]} padding={{horizontal: 18, vertical: 9}}>
						<Text value={progress}/>
						<Text value={'%'}/>
					</HStack>
				),
			}}
			cornerRadius={cornerRadius}
		/>
	);
}

function widget(entry: WidgetEntry<EntryData>) {
	const {pageFrame, layout, forward, flipIndex, current, renderingMode} = entry;
	const previous = entry.previous ?? current;
	const earlier = forward ? previous : current;
	const later = forward ? current : previous;
	const horizontalOffset = current === 'front'
		? -pageFrame.width / 4
		: (current === 'back'
			? pageFrame.width / 4
			: 0);
	const transparent = renderingMode === 'fullColor' && useTransparent;
	return (
		<ZStack
			compositingGroup={transparent}
			luminanceToAlpha={transparent}
			colorInvert={transparent}
		>
			<HFlip
				index={flipIndex}
				delta={forward ? 1 : -1}
				curr={pageContent(current, pageFrame, layout)}
				prev={pageContent(previous, pageFrame, layout)}
				leadingHidden={earlier === 'front'}
				trailingHidden={later === 'back'}
				frame={pageFrame}
				geometryGroup
				pixelPerfectCenter={{x: horizontalOffset}}
				animation_={animation}
			/>
			<HStack>
				<FullButton intent={app.turn(false, layout)} />
				<FullButton intent={app.turn(true, layout)} />
			</HStack>
		</ZStack>
	);
}

function renderPage(request: TextRenderRequest, layout: TextRenderLayout): Page {
	const result = AwaitFile.renderText(bookPath, request, layout);
	if (!result) {
		return request.forward ? 'back' : 'front';
	}

	const {text, lines, startOffset, endOffset, totalBytes} = result;
	return {
		text, lines, startOffset, endOffset, totalBytes,
	};
}

function turn(forward: boolean, layout: TextRenderLayout) {
	// Widget buttons can outlive their entry; use the latest stored progress.
	const {current, previous, layout: savedLayout, forward: lastForward, flipIndex} = readState();
	const sameLayout = compare(savedLayout, layout);
	const content = (sameLayout ? current.content : undefined) ?? renderPage(current.request, layout);
	// Reversing restores the exact page request, even before the next timeline runs.
	let target = sameLayout && forward !== lastForward ? previous : undefined;
	if (!target) {
		if (typeof content === 'string' && forward === current.request.forward) {
			return;
		}

		target = {
			request: {
				offset: typeof content === 'string' ? current.request.offset : (forward ? content.endOffset : content.startOffset),
				forward,
			},
		};
	}

	AwaitStore.set('state', {
		current: target,
		// Keep the request for reversing and the page content for the flip.
		previous: {request: current.request, content},
		layout,
		forward,
		flipIndex: flipIndex + (forward ? 1 : -1),
	});
}

function readState(): ReaderState {
	return AwaitStore.get<ReaderState>('state') ?? {
		current: {request: {offset: 0, forward: false}},
		forward: false,
		flipIndex: 0,
	};
}

function widgetTimeline(context: TimelineContext): Timeline<EntryData> {
	const {width, height} = context.size;
	const evenSize = (size: number) => (padding === 0 ? Math.ceil(size / 2) : Math.floor(size / 2 - padding)) * 2;
	const pageFrame = {width: evenSize(width), height: evenSize(height)};
	const layout: TextRenderLayout = {
		width: pageFrame.width - pagePadding * 2,
		height: pageFrame.height - pagePadding * 2,
		fontSize,
		fontWeight,
		...(lineSpacing > 0 && {lineSpacing}),
		...(fontURL ? {fontURL} : {fontDesign}),
	};
	const state = readState();
	const {forward, flipIndex} = state;
	const sameLayout = compare(state.layout, layout);
	const current = renderPage(state.current.request, layout);
	// Timelines for other layouts must not erase the last turn's pages.
	if (sameLayout) {
		AwaitStore.set('state', {...state, current: {...state.current, content: current}});
	}

	return {
		entries: [{
			date: new Date(),
			pageFrame,
			layout,
			forward,
			flipIndex,
			current,
			previous: sameLayout ? state.previous?.content : undefined,
		}],
	};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {turn},
	widgetFamilies: [
		'small',
		'medium',
		'large',
		'extraLarge',
		'extraLargePortrait',
	],
});
