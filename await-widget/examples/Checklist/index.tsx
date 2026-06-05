import {
	Button, Rectangle, Text, ZStack, Modifier, Image,
} from 'await';

// @panel
const title = 'Life Checklist';

const information = {
	title,
	cells: [
		'Eat Fish',
		'Drink Milk',
		'Eat Eggs',
		'Eat Veggies',
		'Eat Fruit',
		'Eat Beef',
		'Whole Grains',
		'Eat Nuts',
		'Hydrate',
		'Less Sugar',
		'Cook At Home',
		'Skip Takeout',
		'Watch Movie',
		'Watch Anime',
		'Read Novel',
		'Listen Music',
		'Take Walk',
		'Get Sunlight',
		'Fresh Air',
		'Do Laundry',
		'Change Sheets',
		'Tidy Room',
		'Play With Cat',
		'Change Cat Water',
		'Clean Litter',
	],
};

// @panel {type:'slider',min:0,max:4,step:1}
const lineSize = 1;
// @panel {type:'slider',min:1,max:20,step:1}
const fontSize = 14;
// @panel
const showTitle = true;
// @panel {type:'menu',items:['weekly','daily']}
const resetPeriod = 'weekly';
// @panel {type:'slider',min:0,max:40,step:1}
const outerPadding = 20;
// @panel {type:'slider',min:0,max:40,step:1}
const tablePadding = 16;
// @panel {type:'color'}
const paper = 'fffffff4';
// @panel {type:'color'}
const ink = '19';
// @panel {type:'color'}
const marker = 'ffb04284';
// @panel {type:'color'}
const tapeColor = 'ffdabce3';
// @panel {type:'slider',min:-15,max:15,step:1}
const tapeAngle = -3;
// @panel
const image = 'corkboard.jpg';

const smallFont: Font = {
	name: 'Space Grotesk',
	size: fontSize,
	wght: 600,
};

const largeFont: Font = {
	name: 'Space Grotesk',
	size: fontSize * 1.5,
	wght: 600,
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
	return isDailyReset(resetPeriod) ? nextDay(date) : nextWeek(date);
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
	const availableWidth = Math.floor(width - (outerPadding + tablePadding) * 2);
	const availableHeight = Math.floor(height - (outerPadding + tablePadding) * 2);
	const cellWidth = Math.floor((availableWidth - gutter * 6) / 5);
	const contentWidth = cellWidth * 5 + gutter * 4;
	const tableWidth = contentWidth + gutter * 2;
	const horizontalLines = showTitle ? 7 : 6;
	const titleHeight = showTitle
		? Math.floor((availableHeight - gutter * horizontalLines) * 0.18)
		: 0;
	const cellHeight = Math.floor((availableHeight - gutter * horizontalLines - titleHeight) / 5);
	const titleWidth = tableWidth - gutter * 2;
	const tableHeight = titleHeight + cellHeight * 5 + gutter * horizontalLines;
	const titleY = gutter;
	const titleSeparatorY = gutter + titleHeight;
	const bodyTop = showTitle ? gutter * 2 + titleHeight : gutter;
	const bodyHeight = cellHeight * 5 + gutter * 4;
	const paperWidth = tableWidth + tablePadding * 2;
	const paperHeight = tableHeight + tablePadding * 2;
	const tapeWidth = Math.max(32, Math.floor(tableWidth * 0.2));
	const tapeHeight = 16;
	const rowLines = [1, 2, 3, 4].map(row => bodyTop + cellHeight * row + gutter * (row - 1));
	const hLines = [
		{index: 0, y: 0},
		...(showTitle ? [{index: 1, y: titleSeparatorY}] : []),
		...rowLines.map((y, index) => ({index: index + 2, y})),
		{index: 6, y: tableHeight - gutter},
	];

	return (
		<ZStack maxSides foreground={ink}>
			<Image url={image} resizable aspectRatio='fill' />
			<ZStack
				frame={{width: tableWidth, height: tableHeight}}
				frame_={{width: paperWidth, height: paperHeight}}
				background={paper}
				minimumScaleFactor={0.5}
			>
				{showTitle
					? (
						<Text
							id='title'
							value={information.title}
							frame={{
								width: titleWidth,
								height: titleHeight,
							}}
							offsetX={centeredOffset(tableWidth, titleWidth, gutter)}
							offsetY={centeredOffset(tableHeight, titleHeight, titleY)}
							font={largeFont}
						/>
					)
					: undefined}
				<ZStack id='table' font={smallFont}>
					{information.cells.map((label, index) => {
						const row = Math.floor(index / 5);
						const col = index % 5;
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
									gutter + col * (cellWidth + gutter),
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
				<VLine
					index={0}
					tableWidth={tableWidth}
					tableHeight={tableHeight}
					x={0}
					y={0}
					height={tableHeight}
					gutter={gutter}
				/>
				<VLine
					index={5}
					tableWidth={tableWidth}
					tableHeight={tableHeight}
					x={tableWidth - gutter}
					y={0}
					height={tableHeight}
					gutter={gutter}
				/>
				{[1, 2, 3, 4].map(col => (
					<VLine
						index={col}
						tableWidth={tableWidth}
						tableHeight={tableHeight}
						x={gutter + cellWidth * col + gutter * (col - 1)}
						y={bodyTop}
						height={bodyHeight}
						gutter={gutter}
					/>
				))}
			</ZStack>
			<Rectangle
				id='tape'
				fill={tapeColor}
				width={tapeWidth}
				height={tapeHeight}
				rotationEffect={tapeAngle}
				offsetY={centeredOffset(paperHeight, tapeHeight, -tapeHeight / 2)}
			/>
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
});
