import {
	Button,
	Rectangle,
	Text,
	ZStack,
	Modifier,
	Image,
} from 'await';

// @panel {title:'Title',title_zh:'标题'}
const title = 'CHECKLIST';
// @panel {type:'strings',title:'Tasks',title_zh:'事项',min:1,max:25}
const cells = [
	'Eat Veggies',
	'Drink Water',
	'Exercise',
	'Sleep Well',
	'Read Books',
	'Meditate',
	'Walk Outside',
	'Eat Fruit',
	'Limit Screen Time',
];

// @panel {type:'slider',min:0,max:4,step:1,title:'Line Size',title_zh:'线条粗细'}
const lineSize = 1;
// @panel {type:'slider',min:1,max:20,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 12;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 700;
// @panel {type:'menu',items:['monospaced','rounded','serif','default'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'default';
// @panel {title:'Show Title',title_zh:'显示标题'}
const showTitle = true;
// @panel {type:'menu',items:['weekly','daily'],title:'Reset Period',title_zh:'重置周期'}
const resetPeriod = 'weekly';
// @panel {type:'slider',min:8,max:24,step:1,title:'Padding',title_zh:'内边距'}
const padding = 12;
// @panel {type:'color',title:'Paper Color',title_zh:'纸张颜色'}
const paper = 'f9d3e0';
// @panel {type:'color',title:'Ink Color',title_zh:'墨水颜色'}
const ink = 'e63b7a';
// @panel {type:'color',title:'Marker Color',title_zh:'标记颜色'}
const marker = 'feb43f80';
// @panel {title:'Image URL',title_zh:'图片路径'}
const image = '';

const smallFont: Mods = {
	fontDesign,
	fontSize,
	fontWeight,
};

const largeFont: Mods = {
	fontDesign,
	fontSize: fontSize * 1.5,
	fontWeight,
};

function dateKey(date: Date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function weekKey(date: Date) {
	const monday = new Date(date);
	monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
	return dateKey(monday);
}

function nextWeek(date: Date) {
	const next = new Date(date);
	next.setDate(date.getDate() + (7 - ((date.getDay() + 6) % 7)));
	next.setHours(0, 0, 0, 0);
	return next;
}

function nextDay(date: Date) {
	const next = new Date(date);
	next.setDate(date.getDate() + 1);
	next.setHours(0, 0, 0, 0);
	return next;
}

function isDailyReset(period: string) {
	return period === 'daily';
}

function resetKey(date: Date, period: string) {
	return isDailyReset(period)
		? `daily-${dateKey(date)}`
		: `weekly-${weekKey(date)}`;
}

function nextReset(date: Date) {
	return (isDailyReset(resetPeriod) ? nextDay : nextWeek)(date);
}

function syncReset(date: Date) {
	const key = resetKey(date, resetPeriod);
	const storedPeriod = AwaitStore.string('resetPeriod');
	const storedKey = AwaitStore.string('resetKey');

	if (storedPeriod !== resetPeriod || storedKey === '') {
		AwaitStore.set('resetPeriod', resetPeriod);
		AwaitStore.set('resetKey', key);
		return;
	}

	if (storedKey !== key) {
		AwaitStore.set('done', []);
		AwaitStore.set('resetKey', key);
	}
}

const buttonStyle: CustomButtonStyle = {
	press: (
		<Modifier scaleEffect={0.9} animation={{type: 'spring', duration: 0.1}} />
	),
	normal: (
		<Modifier scaleEffect={1} animation={{type: 'spring', duration: 0.3}} />
	),
};

function BingoCell({
	index,
	label,
	done,
	width,
	height,
	offsetX,
	offsetY,
}: {
	index: number;
	label: string;
	done: boolean;
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
}) {
	return (
		<ZStack frame={{width, height}} offsetX={offsetX} offsetY={offsetY}>
			{done
				? (
					<Rectangle fill={marker} width={width} height={height} />
				)
				: undefined}
			<Button intent={app.toggle(index)} buttonStyle={buttonStyle}>
				<Text
					value={label}
					textAlignment='center'
					foreground={ink}
					padding={2}
					maxSides
					geometryGroup
				/>
			</Button>
		</ZStack>
	);
}

function centeredOffset(size: number, childSize: number, start: number) {
	return -size / 2 + start + childSize / 2;
}

function HLine({
	index,
	tableWidth,
	tableHeight,
	y,
	gutter,
}: {
	index: number;
	tableWidth: number;
	tableHeight: number;
	y: number;
	gutter: number;
}) {
	return (
		<Rectangle
			id={`h-line-${index}`}
			fill={ink}
			width={tableWidth}
			height={gutter}
			offsetY={centeredOffset(tableHeight, gutter, y)}
		/>
	);
}

function VLine({
	index,
	tableWidth,
	tableHeight,
	x,
	y,
	height,
	gutter,
}: {
	index: number;
	tableWidth: number;
	tableHeight: number;
	x: number;
	y: number;
	height: number;
	gutter: number;
}) {
	return (
		<Rectangle
			id={`v-line-${index}`}
			fill={ink}
			width={gutter}
			height={height}
			offsetX={centeredOffset(tableWidth, gutter, x)}
			offsetY={centeredOffset(tableHeight, height, y)}
		/>
	);
}

function widget(entry: WidgetEntry<{done: number[]}>) {
	const {width, height} = entry.size;
	const gutter = Math.round(lineSize);
	const cellCount = cells.length;
	const gridSize = Math.ceil(Math.sqrt(cellCount));
	const availableWidth = Math.floor(width - padding * 2);
	const availableHeight = Math.floor(height - padding * 2);
	const cellWidth = Math.floor((availableWidth - gutter * (gridSize - 1)) / gridSize);
	const tableWidth = cellWidth * gridSize + gutter * (gridSize - 1);
	const horizontalLines = showTitle ? gridSize : gridSize - 1;
	const titleHeight = showTitle
		? Math.floor((availableHeight - gutter * horizontalLines) * 0.18)
		: 0;
	const cellHeight = Math.floor((availableHeight - gutter * horizontalLines - titleHeight) / gridSize);
	const tableHeight = titleHeight + cellHeight * gridSize + gutter * horizontalLines;
	const bodyTop = showTitle ? titleHeight + gutter : 0;
	const bodyHeight = cellHeight * gridSize + gutter * (gridSize - 1);
	const rowLines = Array.from({length: gridSize - 1}, (_, i) =>
		bodyTop + cellHeight * (i + 1) + gutter * i);
	const hLines = [
		...(showTitle ? [{index: 0, y: titleHeight}] : []),
		...rowLines.map((y, index) => ({index: index + (showTitle ? 1 : 0), y})),
	];
	const items = cells.slice(0, gridSize * gridSize);

	return (
		<ZStack maxSides foreground={ink} background={paper}>
			<Image resizable aspectRatio='fill' url={image}/>
			<ZStack
				frame={{width: tableWidth, height: tableHeight}}
				minimumScaleFactor={0.1}
			>
				{showTitle
					? (
						<Text
							id='title'
							value={title}
							frame={{
								width: tableWidth,
								height: titleHeight,
							}}
							offsetY={centeredOffset(tableHeight, titleHeight, 0)}
							{...largeFont}
						/>
					)
					: undefined}
				<ZStack id='table' {...smallFont}>
					{items.map((label, index) => {
						const row = Math.floor(index / gridSize);
						const col = index % gridSize;
						return (
							<BingoCell
								index={index}
								label={label}
								done={entry.done.includes(index)}
								width={cellWidth}
								height={cellHeight}
								offsetX={centeredOffset(
									tableWidth,
									cellWidth,
									col * (cellWidth + gutter),
								)}
								offsetY={centeredOffset(
									tableHeight,
									cellHeight,
									bodyTop + row * (cellHeight + gutter),
								)}
							/>
						);
					})}
				</ZStack>
				{hLines.map(line => (
					<HLine
						index={line.index}
						tableWidth={tableWidth}
						tableHeight={tableHeight}
						y={line.y}
						gutter={gutter}
					/>
				))}
				{Array.from({length: gridSize - 1}, (_, col) => (
					<VLine
						index={col + 1}
						tableWidth={tableWidth}
						tableHeight={tableHeight}
						x={cellWidth * (col + 1) + gutter * col}
						y={bodyTop}
						height={bodyHeight}
						gutter={gutter}
					/>
				))}
			</ZStack>
		</ZStack>
	);
}

function widgetTimeline() {
	const now = new Date();
	syncReset(now);
	return {
		entries: [
			{
				date: now,
				done: AwaitStore.array<number>('done'),
			},
		],
		update: nextReset(now),
	};
}

function toggle(index: number) {
	const done = AwaitStore.array<number>('done');
	AwaitStore.set(
		'done',
		done.includes(index)
			? done.filter(item => item !== index)
			: [...done, index],
	);
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {toggle},
	widgetFamilies: ['small', 'medium', 'large', 'extraLarge', 'extraLargePortrait'],
});
