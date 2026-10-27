import {
	Circle,
	FullButton,
	HStack,
	Rectangle,
	Spacer,
	Text,
	Time,
	ZStack,
} from 'await';

// @panel {type:'strings',min:0,title_zh:'事项',title_en:'Activities'}
const names: string[] = [
	'Read',
	'Sport',
	'Game',
	'Music',
	'Work',
];
// @panel {type:'slider',min:0.8,max:1.2,step:0.01,title_zh:'字号比例',title_en:'Font scale'}
const itemFontScale = 1;
// @panel {type:'menu',items:['Blue','Purple','Yellow','Green','Transparent'],title_zh:'背景',title_en:'Background'}
const theme = 'Yellow';
// @panel {type:'slider',min:24,max:40,step:1,title_zh:'最小行高',title_en:'Minimum row height'}
const minimumItemRowHeight = 30;
// @panel {type:'slider',min:44,max:80,step:1,title_zh:'表头高度',title_en:'Header height'}
const largeHeaderHeight = 60;
// @panel {type:'slider',min:0,max:44,step:1,title_zh:'左右留白',title_en:'Side padding'}
const sidePadding = 16;
// @panel {type:'slider',min:0,max:20,step:1,title_zh:'单元留白',title_en:'Cell padding'}
const cellInset = 8;
// @panel {title_zh:'列分割',title_en:'Column dividers'}
const showColumnRules = false;
// @panel {title_zh:'页头',title_en:'Header'}
const title = 'Time Record';
// @panel {title_zh:'页尾',title_en:'Footer'}
const footerText = '';
const numberColumnLabel = 'NO.';
const activityColumnLabel = 'Name';
const elapsedColumnLabel = 'Time';

const columnRatios: number[] = [1, 2, 2];

const palettes: Record<string, {paper?: Color; ink: Color}> = {
	Blue: {paper: '#87CEFA', ink: '#204760CC'},
	Purple: {paper: '#E9A1F5', ink: '#4C285ACC'},
	Yellow: {paper: '#FFD08A', ink: '#5B3920CC'},
	Green: {paper: '#8CCB75', ink: '#2E4D25CC'},
	Transparent: {ink: '#FFFFFFCC'},
};
const {paper, ink} = palettes[theme];
const onInk = paper ?? ink;
const spaceGrotesk = (fontSize: number, fontWeight: number): Font => ({
	name: 'Space Grotesk',
	size: fontSize,
	wght: fontWeight,
});

const grid = (steps: number) => steps * 4;
const typeSize = (step: number) => 6.5 * 1.5 ** step;

type Layout = {
	width: number;
	small: boolean;
	compact: boolean;
	contentWidth: number;
	headerHeight: number;
	headerRuleY: number;
	rowTop: number;
	rowHeight: number;
	rowBoxHeight: number;
	rowCapacity: number;
	itemFontSize: number;
	itemDotSize: number;
	tableWidth: number;
	tableHeaderY: number;
	numberTextWidth: number;
	nameTextWidth: number;
	timeTextWidth: number;
	numberCellX: number;
	nameCellX: number;
	timeCellX: number;
	numberDividerX: number;
	timeDividerX: number;
	footerHeight: number;
	footerTop: number;
};

type EntryData = {
	layout: Layout;
};

type Row = {
	name: string;
	start: number;
	elapsed: number;
};

function makeLayout({size, family}: TimelineContext): Layout {
	const {width, height} = size;
	const small = family === 'small';
	const compact = small || family === 'medium';
	const margin = sidePadding * (small ? 4 : 7) / 7;
	const contentWidth = width - margin * 2;
	const tableBandRatio = 2 / 3;
	const tableHeaderExtra = compact ? 0 : 1;
	const reservedHeaderHeight = compact ? 0 : largeHeaderHeight + tableHeaderExtra;
	const availableTableHeight = height - reservedHeaderHeight;
	const headerRowCount = compact ? 1 : 0;
	const tableBandCount = compact ? 1 : 2;
	const rowCapacity = Math.floor(availableTableHeight / minimumItemRowHeight - headerRowCount - tableBandCount * tableBandRatio);
	const rowHeight = availableTableHeight / (rowCapacity + headerRowCount + tableBandCount * tableBandRatio);
	const tableHeaderHeight = compact ? 0 : rowHeight * tableBandRatio + tableHeaderExtra;
	const footerHeight = rowHeight * tableBandRatio;
	const footerTop = height - footerHeight;
	const headerHeight = compact ? rowHeight : largeHeaderHeight;
	const headerRuleY = headerHeight;
	const rowTop = headerRuleY + tableHeaderHeight;
	const tableHeaderY = (headerRuleY + rowTop) / 2;
	const tableWidth = contentWidth;
	const [numberRatio, nameRatio, timeRatio] = columnRatios;
	const columnUnit = tableWidth / (numberRatio + nameRatio + timeRatio);
	const numberDividerX = small ? margin : margin + columnUnit * numberRatio;
	const timeDividerX = margin + (small ? tableWidth / 2 : columnUnit * (numberRatio + nameRatio));
	const numberCellWidth = numberDividerX - margin;
	const nameCellWidth = timeDividerX - numberDividerX;
	const timeCellWidth = margin + tableWidth - timeDividerX;
	const numberCellX = margin + numberCellWidth / 2;
	const nameCellX = numberDividerX + nameCellWidth / 2;
	const timeCellX = timeDividerX + timeCellWidth / 2;

	return {
		width,
		small,
		compact,
		contentWidth,
		headerHeight,
		headerRuleY,
		rowTop,
		rowHeight,
		rowBoxHeight: rowHeight + 1,
		rowCapacity,
		itemFontSize: typeSize(2) * itemFontScale,
		itemDotSize: rowHeight * 0.16,
		tableWidth,
		tableHeaderY,
		numberTextWidth: numberCellWidth - cellInset * 2,
		nameTextWidth: nameCellWidth - cellInset * 2,
		timeTextWidth: timeCellWidth - cellInset * 2,
		numberCellX,
		nameCellX,
		timeCellX,
		numberDividerX,
		timeDividerX,
		footerHeight,
		footerTop,
	};
}

function widgetTimeline(context: TimelineContext) {
	return {
		entries: [{date: new Date(), layout: makeLayout(context)}],
	};
}

function widget(entry: WidgetEntry<EntryData>) {
	const {layout, renderingMode} = entry;
	const rows = names.slice(0, layout.rowCapacity).map((name, index) => ({
		name,
		start: AwaitStore.num(`timeReceipt.start.${index}`, 0),
		elapsed: AwaitStore.num(`timeReceipt.elapsed.${index}`, 0),
	}));

	return (
		<ZStack frame={entry.size} background={paper}>
			<Header layout={layout}/>
			<RowHighlights rows={rows} layout={layout} renderingMode={renderingMode}/>
			<TableRules layout={layout}/>
			<TableHeader layout={layout}/>
			<ColumnRules layout={layout}/>
			<Footer layout={layout}/>
			{rows.map((row, index) => (
				<TimerRow row={row} index={index} layout={layout}/>
			))}
		</ZStack>
	);
}

function Header({layout}: {layout: Layout}) {
	const {width, small, compact, contentWidth, headerHeight} = layout;
	const content = small
		? (
			<Text
				value={title}
				font={spaceGrotesk(typeSize(2), 700)}
				foreground={ink}
				textAlignment='center'
				lineLimit={1}
				minimumScaleFactor={0.5}
				frame={{width: contentWidth, alignment: 'center'}}
			/>
		)
		: (
			<HStack alignment='firstTextBaseline' spacing={0} frame={{width: contentWidth - cellInset * 2}}>
				<Text
					value={title}
					font={spaceGrotesk(typeSize(compact ? 2 : 2.5), 700)}
					foreground={ink}
					lineLimit={1}
					minimumScaleFactor={0.5}
				/>
				<Spacer minLength={grid(3)}/>
				<Time
					format={[
						{field: 'year'},
						'.',
						{field: 'month', style: 'twoDigits'},
						'.',
						{field: 'day', style: 'twoDigits'},
					]}
					font={spaceGrotesk(typeSize(1), 700)}
					monospacedDigit
					foreground={ink}
					textAlignment='trailing'
					contentTransition='identity'
				/>
			</HStack>
		);

	return (
		<ZStack frame={{width: contentWidth, height: headerHeight}} position={{x: width / 2, y: headerHeight / 2}}>
			{content}
		</ZStack>
	);
}

function RowHighlights({
	rows,
	layout,
	renderingMode,
}: {
	rows: Row[];
	layout: Layout;
	renderingMode: RenderingMode;
}) {
	const {width, tableWidth, rowTop, rowHeight, rowBoxHeight} = layout;
	const highlightOpacity = renderingMode !== 'fullColor' || theme as string === 'Transparent' ? 0.5 : 1;
	return rows.map((row, index) => (
		<Rectangle
			id={`active-row-${index}`}
			fill={ink}
			opacity={row.start > 0 ? highlightOpacity : 0}
			frame={{width: tableWidth, height: rowBoxHeight}}
			position={{x: width / 2, y: rowTop + rowHeight * (index + 0.5) - 0.5}}
		/>
	));
}

function TableRules({layout}: {layout: Layout}) {
	const {width, compact, tableWidth, headerRuleY, rowTop, rowHeight, rowCapacity} = layout;
	return [
		<Rectangle
			fill={ink}
			opacity={1}
			frame={{width: tableWidth, height: 1}}
			frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
			position={{x: width / 2, y: headerRuleY}}
		/>,
		compact
			? undefined
			: (
				<Rectangle
					fill={ink}
					opacity={0.35}
					frame={{width: tableWidth, height: 1}}
					frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
					position={{x: width / 2, y: rowTop}}
				/>
			),
		...Array.from({length: rowCapacity}, (_, index) => (
			<Rectangle
				id={`separator-${index}`}
				fill={ink}
				opacity={0.35}
				frame={{width: tableWidth, height: 1}}
				frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
				position={{x: width / 2, y: rowTop + rowHeight * (index + 1)}}
			/>
		)),
	];
}

function TableHeader({layout}: {layout: Layout}) {
	if (layout.compact) {
		return undefined;
	}

	const {tableHeaderY, numberTextWidth, nameTextWidth, timeTextWidth, numberCellX, nameCellX, timeCellX} = layout;
	return [
		<Text
			value={numberColumnLabel}
			font={spaceGrotesk(typeSize(1), 700)}
			textAlignment='leading'
			foreground={ink}
			frame={{width: numberTextWidth, height: grid(3), alignment: 'leading'}}
			position={{x: numberCellX, y: tableHeaderY}}
		/>,
		<Text
			value={activityColumnLabel}
			font={spaceGrotesk(typeSize(1), 700)}
			textAlignment='leading'
			foreground={ink}
			frame={{width: nameTextWidth, height: grid(3), alignment: 'leading'}}
			position={{x: nameCellX, y: tableHeaderY}}
		/>,
		<Text
			value={elapsedColumnLabel}
			font={spaceGrotesk(typeSize(1), 700)}
			textAlignment='trailing'
			foreground={ink}
			frame={{width: timeTextWidth, height: grid(3), alignment: 'trailing'}}
			position={{x: timeCellX, y: tableHeaderY}}
		/>,
	];
}

function ColumnRules({layout}: {layout: Layout}) {
	if (!showColumnRules) {
		return undefined;
	}

	const {small, headerRuleY, footerTop, numberDividerX, timeDividerX} = layout;
	return (small ? [timeDividerX] : [numberDividerX, timeDividerX]).map((x, index) => (
		<Rectangle
			id={`column-rule-${index}`}
			fill={ink}
			opacity={0.35}
			frame={{width: 1, height: footerTop - headerRuleY}}
			position={{x, y: (headerRuleY + footerTop) / 2}}
		/>
	));
}

function Footer({layout}: {layout: Layout}) {
	const {width, contentWidth, footerHeight, footerTop} = layout;
	return (
		<Text
			value={footerText}
			font={spaceGrotesk(typeSize(0), 700)}
			textAlignment='center'
			foreground={ink}
			frame={{width: contentWidth, height: footerHeight, alignment: 'center'}}
			position={{x: width / 2, y: footerTop + footerHeight / 2}}
		/>
	);
}

function TimerRow({row, index, layout}: {row: Row; index: number; layout: Layout}) {
	const {
		width,
		small,
		rowTop,
		rowHeight,
		rowBoxHeight,
		numberTextWidth,
		nameTextWidth,
		timeTextWidth,
		numberCellX,
		nameCellX,
		timeCellX,
		itemFontSize,
		itemDotSize,
	} = layout;
	const active = row.start > 0;
	const centerY = rowTop + rowHeight * (index + 0.5) - 0.5;

	return (
		<ZStack id={`timer-${index}`} frame={{width, height: rowBoxHeight}} position={{x: width / 2, y: centerY}}>
			{small
				? undefined
				: (
					<ZStack frame={{width: numberTextWidth, height: rowHeight, alignment: 'leading'}} position={{x: numberCellX, y: rowBoxHeight / 2}}>
						<Text
							value={String(index + 1).padStart(2, '0')}
							font={spaceGrotesk(itemFontSize, 700)}
							foreground={ink}
							opacity={active ? 0 : 1}
						/>
						<Circle
							fill={onInk}
							opacity={active ? 1 : 0}
							frame={{width: itemDotSize, height: itemDotSize}}
						/>
					</ZStack>
				)}
			<Text
				value={row.name}
				font={spaceGrotesk(itemFontSize, 700)}
				textAlignment='leading'
				foreground={active ? onInk : ink}
				lineLimit={1}
				frame={{width: nameTextWidth, height: rowHeight, alignment: 'leading'}}
				position={{x: nameCellX, y: rowBoxHeight / 2}}
			/>
			{active
				? (
					<Time
						date={new Date(row.start)}
						format={{
							type: 'stopwatch',
							showsHours: true,
							maxFieldCount: 3,
							maxPrecision: 1,
						}}
						font={spaceGrotesk(itemFontSize, 700)}
						monospacedDigit
						textAlignment='trailing'
						foreground={onInk}
						frame={{width: timeTextWidth, height: rowHeight, alignment: 'trailing'}}
						position={{x: timeCellX, y: rowBoxHeight / 2}}
					/>
				)
				: (
					<Text
						value={formatElapsed(row.elapsed)}
						font={spaceGrotesk(itemFontSize, 700)}
						monospacedDigit
						textAlignment='trailing'
						foreground={ink}
						frame={{width: timeTextWidth, height: rowHeight, alignment: 'trailing'}}
						position={{x: timeCellX, y: rowBoxHeight / 2}}
					/>
				)}
			<FullButton
				intent={app.toggle(index)}
				frame={{width, height: rowBoxHeight}}
			/>
		</ZStack>
	);
}

function formatElapsed(milliseconds: number) {
	const seconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(seconds / 3700);
	const minutes = Math.floor(seconds % 3700 / 60);
	const remainder = seconds % 60;
	const minuteSecond = `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
	return hours > 0 ? `${String(hours).padStart(2, '0')}:${minuteSecond}` : minuteSecond;
}

function toggle(index: number) {
	const now = Date.now();
	const currentStartKey = `timeReceipt.start.${index}`;
	const currentStart = AwaitStore.num(currentStartKey, 0);
	if (currentStart > 0) {
		AwaitStore.set(`timeReceipt.elapsed.${index}`, now - currentStart);
		AwaitStore.delete(currentStartKey);
		return;
	}

	AwaitStore.set(`timeReceipt.elapsed.${index}`, 0);
	AwaitStore.set(currentStartKey, now);
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetFamilies: ['small', 'medium', 'large', 'extraLargePortrait'],
	widgetIntents: {toggle},
});
