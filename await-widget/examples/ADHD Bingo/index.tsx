import {
	Button,
	Rectangle,
	Text,
	VStack,
	HStack,
	ZStack,
	Modifier,
} from 'await';

// @panel {type:'color'}
const paper = 'fbfaf5';
// @panel {type:'color'}
const ink = '242326';
// @panel {type:'color'}
const line = '4f9a48';
// @panel {type:'color'}
const marker = 'f29a1a';
// @panel {type:'color'}
const orange = 'f29a1a';

const cells = [
	'拿出\n回收物',
	'整理\n厨房',
	'做了件\n有趣的事！',
	'付了一笔\n账单',
	'洗了一机\n衣服',
	'买了生活\n必需品',
	'闹钟响\n就起床',
	'完成\n重要任务',
	'深呼吸',
	'重复\n肯定句',
	'休息\n15分钟',
	'出门\n散步',
	'背单词',
	'洗澡',
	'整理\n床铺',
	'清掉\n杂物',
	'吃了一顿饭',
	'收拾\n自己用过的',
	'喝水',
	'和朋友\n联系',
	'吃药',
	'照顾\n宠物需求',
	'刷牙',
	'吸尘\n或扫地',
	'给植物\n浇水',
];

const largeCells = new Set([8, 12, 13, 18, 20, 22]);
// @panel {type:'slider',min:1,max:4,step:1}
const lineSize = 1;

function dayKey(date: Date) {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function nextMidnight(date: Date) {
	const next = new Date(date);
	next.setHours(24, 0, 0, 0);
	return next;
}

function todayDone(date = new Date()) {
	const today = dayKey(date);
	if (AwaitStore.string('day') !== today) {
		AwaitStore.set('day', today);
		AwaitStore.set('done', []);
	}

	return AwaitStore.array<number>('done');
}

function DoneMark({index, width, height}: {
	index: number;
	width: number;
	height: number;
}) {
	const drift = (index % 5) - 2;
	const tilt = [-9, 6, -5, 8, -7][index % 5];
	return (
		<ZStack frame={{width, height}}>
			<Rectangle
				fill={marker}
				opacity={0.55}
				width={width * (0.76 + (index % 3) * 0.06)}
				height={height * 0.22}
				cornerRadius={height * 0.11}
				rotationEffect={tilt}
				offsetX={drift * 2}
				offsetY={-height * 0.04}
			/>
			<Rectangle
				fill={marker}
				opacity={0.5}
				width={width * (0.58 + (index % 4) * 0.07)}
				height={height * 0.18}
				cornerRadius={height * 0.09}
				rotationEffect={-tilt * 0.7}
				offsetX={-drift * 3}
				offsetY={height * 0.11}
			/>
		</ZStack>
	);
}

const buttonStyle: CustomButtonStyle = {
	press: <Modifier
		geometryGroup
		scaleEffect={0.9}
		animation={{type: 'spring', duration: 0.1}}
	/>,
	normal: <Modifier
		geometryGroup
		scaleEffect={1}
		animation={{type: 'spring', duration: 0.5}}
	/>,
};

function BingoCell({index, done, width, height, fontSize}: {
	index: number;
	done: boolean;
	width: number;
	height: number;
	fontSize: number;
}) {
	return (
		<Button intent={app.toggle(index)} buttonStyle={buttonStyle}>
			<ZStack frame={{width, height}}>
				{done ? <DoneMark index={index} width={width} height={height}/> : undefined}
				<Text
					value={cells[index]}
					fontSize={largeCells.has(index) ? fontSize * 1.22 : fontSize}
					fontWeight={largeCells.has(index) ? 500 : 400}
					foreground={ink}
					lineLimit={2}
					minimumScaleFactor={0.1}
					textAlignment='center'
					maxSides
					padding={{horizontal: 2}}
					id={index}
				/>
			</ZStack>
		</Button>
	);
}

function HRule({width, offsetY}: {
	width: number;
	offsetY: number;
}) {
	return (
		<Rectangle
			fill={line}
			width={width}
			height={lineSize}
			offsetY={offsetY}
		/>
	);
}

function VRule({height, offsetX}: {
	height: number;
	offsetX: number;
}) {
	return (
		<Rectangle
			fill={line}
			width={lineSize}
			height={height}
			offsetX={offsetX}
		/>
	);
}

function GridLines({width, height, cellWidth, cellHeight}: {
	width: number;
	height: number;
	cellWidth: number;
	cellHeight: number;
}) {
	return (
		<ZStack frame={{width, height}}>
			{[0, 1, 2, 3, 4, 5].map(row => (
				<HRule width={width} offsetY={-height / 2 + lineSize / 2 + row * (cellHeight + lineSize)}/>
			))}
			{[0, 1, 2, 3, 4, 5].map(col => (
				<VRule height={height} offsetX={-width / 2 + lineSize / 2 + col * (cellWidth + lineSize)}/>
			))}
		</ZStack>
	);
}

function cellOffset(size: number, cellSize: number, index: number) {
	return -size / 2 + lineSize + cellSize / 2 + index * (cellSize + lineSize);
}

function widget(entry: WidgetEntry<{done: number[]}>) {
	const {width, height} = entry.size;
	const hideTitle = entry.family === 'small' || entry.family === 'medium';
	const padding = 12;
	const tableWidth = Math.floor(width - padding * 2);
	const tableHeight = Math.floor(height - padding * 2);
	const titleHeight = hideTitle ? 0 : Math.floor(tableHeight * 0.13);
	const cellWidth = Math.floor((tableWidth - lineSize * 6) / 5);
	const cellHeight = Math.floor((tableHeight - titleHeight - lineSize * 6) / 5);
	const gridWidth = cellWidth * 5 + lineSize * 6;
	const gridHeight = cellHeight * 5 + lineSize * 6;
	const fontSize = 16;
	const titleSize = 32;

	return (
		<ZStack maxSides background={paper} foreground={ink}>
			<ZStack>
				<VStack>
					{hideTitle
						? undefined
						: <ZStack>
							<Text fontSize={titleSize} fontWeight={700} height={titleHeight}>
								<Text
									value='ADHD'
									foreground={orange}
								/>
								<Text
									value=' Bingo'
									foreground={ink}
								/>
							</Text>
						</ZStack>}
					<ZStack frame={{width: gridWidth, height: gridHeight}}>
						<GridLines width={gridWidth} height={gridHeight} cellWidth={cellWidth} cellHeight={cellHeight}/>
						{[0, 1, 2, 3, 4].map(row => (
							<ZStack>
								{[0, 1, 2, 3, 4].map(col => {
									const index = row * 5 + col;
									return (
										<ZStack
											frame={{width: cellWidth, height: cellHeight}}
											offsetX={cellOffset(gridWidth, cellWidth, col)}
											offsetY={cellOffset(gridHeight, cellHeight, row)}
										>
											<BingoCell
												index={index}
												done={entry.done.includes(index)}
												width={cellWidth}
												height={cellHeight}
												fontSize={fontSize}
											/>
										</ZStack>
									);
								})}
							</ZStack>
						))}
					</ZStack>
				</VStack>
			</ZStack>
		</ZStack>
	);
}

function widgetTimeline() {
	const now = new Date();
	return {
		entries: [{
			date: now,
			done: todayDone(now),
		}],
		update: nextMidnight(now),
	};
}

function toggle(index: number) {
	const done = todayDone();
	AwaitStore.set('done', done.includes(index) ? done.filter(item => item !== index) : [...done, index]);
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {toggle},
});
