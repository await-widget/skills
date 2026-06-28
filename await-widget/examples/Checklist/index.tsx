import {
	Button,
	Rectangle,
	Text,
	ZStack,
	Modifier,
	Image,
} from 'await';

// @panel
const title = 'CHECKLIST';

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
const fontSize = 12;
// @panel {type:'slider',min:100,max:900,step:100}
const fontWeight = 700;
// @panel {type:'menu',items:['monospaced','rounded','serif','default']}
const fontDesign = 'default';
// @panel
const showTitle = true;
// @panel {type:'menu',items:['weekly','daily']}
const resetPeriod = 'weekly';
// @panel {type:'slider',min:8,max:24,step:1}
const padding = 12;
// @panel {type:'color'}
const paper = 'f9d3e0';
// @panel {type:'color'}
const ink = 'e63b7a';
// @panel {type:'color'}
const marker = 'feb43f80';
// @panel
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
	const availableWidth = Math.floor(width - padding * 2);
	const availableHeight = Math.floor(height - padding * 2);
	const cellWidth = Math.floor((availableWidth - gutter * 4) / 5);
	const tableWidth = cellWidth * 5 + gutter * 4;
	const horizontalLines = showTitle ? 5 : 4;
	const titleHeight = showTitle
		? Math.floor((availableHeight - gutter * horizontalLines) * 0.18)
		: 0;
	const cellHeight = Math.floor((availableHeight - gutter * horizontalLines - titleHeight) / 5);
	const tableHeight = titleHeight + cellHeight * 5 + gutter * horizontalLines;
	const bodyTop = showTitle ? titleHeight + gutter : 0;
	const bodyHeight = cellHeight * 5 + gutter * 4;
	const rowLines = [1, 2, 3, 4].map(row => bodyTop + cellHeight * row + gutter * (row - 1));
	const hLines = [
		...(showTitle ? [{index: 0, y: titleHeight}] : []),
		...rowLines.map((y, index) => ({index: index + (showTitle ? 1 : 0), y})),
	];

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
							value={information.title}
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
				{[1, 2, 3, 4].map(col => (
					<VLine
						index={col}
						tableWidth={tableWidth}
						tableHeight={tableHeight}
						x={cellWidth * col + gutter * (col - 1)}
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
});
