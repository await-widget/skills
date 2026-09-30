import {
	Button,
	Capsule,
	FullButton,
	HStack,
	RoundedRectangle,
	Text,
	VStack,
	ZStack,
} from 'await';

type Direction = 'up' | 'left' | 'down' | 'right';
type Tile = {
	id: Encodable;
	value: number;
	x: number;
	y: number;
};
type RenderTile = Tile & {
	scale: number;
	opacity: number;
	zIndex: number;
};
type LayoutMetrics = {
	pad: number;
	gap: number;
	contentWidth: number;
	bodyHeight: number;
	sidebarWidth: number;
	titleHeight: number;
	scoreHeight: number;
	newHeight: number;
	boardWidth: number;
	boardHeight: number;
	boardRadius: number;
	cellGap: number;
	cellWidth: number;
	cellHeight: number;
	cellRadius: number;
	innerWidth: number;
	innerHeight: number;
	stepX: number;
	stepY: number;
	originX: number;
	originY: number;
};
type EntryData = {
	renderTiles: RenderTile[];
	score: number;
	best: number;
	won: boolean;
	gameOver: boolean;
};
type GameState = EntryData & {
	tiles: Tile[];
	nextTileId: Encodable;
	moves: number;
};
type ThemeColors = Record<string, Color>;

// @panel {type:'menu',items:['Y2K','VOLT'],title_zh:'配色',title_en:'Theme'}
const theme: 'Y2K' | 'VOLT' = 'Y2K';
// @panel {type:'menu',items:['LEFT','RIGHT'],title_zh:'侧栏位置',title_en:'Sidebar side'}
const padSide: 'LEFT' | 'RIGHT' = 'RIGHT';

const themes: Record<string, ThemeColors> = {
	Y2K: {
		bgTop: '#FFE1F5',
		bgMid: '#E9DFFF',
		bgBottom: '#DEF2FF',
		board: '#D6C5FF',
		cell: '#F3ECFF',
		card: '#FFFFFF',
		scoreInk: '#33204A',
		action1: '#1E90FF',
		action2: '#A78BFF',
		action3: '#FF9ED8',
		action4: '#FFCBA4',
		actionInk: '#33204A',
		scrim: ['#33204A', 0.4],
		overlayInk: '#FFFFFF',
		ink: '#33204A',
		inkLight: '#FFFFFF',
		tile2: '#E3F7FF',
		tile4: '#C9EDFF',
		tile8: '#ABE1FF',
		tile16: '#CFBBFF',
		tile32: '#B295FF',
		tile64: '#8F6BFF',
		tile128: '#FFB3E8',
		tile256: '#FF8FDD',
		tile512: '#FF63CB',
		tile1024: '#FF3DBE',
		tile2048: '#E01BFF',
		tileHigh: '#5B2BB8',
	},
	VOLT: {
		bgTop: '#1A1C22',
		bgMid: '#121318',
		bgBottom: '#0A0B0E',
		board: '#1C1F26',
		cell: '#282C35',
		card: '#1E2128',
		scoreInk: '#E8EAED',
		action1: '#E2FF52',
		action2: '#9BE81F',
		actionInk: '#131408',
		scrim: ['#000000', 0.55],
		overlayInk: '#FFFFFF',
		ink: '#14151A',
		inkLight: '#F2F4F8',
		tile2: '#2E323C',
		tile4: '#3A4150',
		tile8: '#4A5263',
		tile16: '#5C6678',
		tile32: '#707B8F',
		tile64: '#8A95A8',
		tile128: '#FF8A3D',
		tile256: '#FF6B2B',
		tile512: '#FF4D2B',
		tile1024: '#FF2D55',
		tile2048: '#C6FF3D',
		tileHigh: '#FFD500',
	},
};

const duration = 0.15;
const GRID_SIZE = 4;
const STORE_STATE_KEY = 'g';
const TILE_Z_INDEX = 2;
const NEW_TILE_Z_INDEX = 3;
const GHOST_TILE_Z_INDEX = 1;
const FADE_TILE_Z_INDEX = 0;
const OVERLAY_Z_INDEX = 9;
const PAD = 8;
const GAP = 8;
const SIDEBAR_WIDTH = 72;
const BOARD_PAD = 8;
const WIDGET_RADIUS = 86 / 3;
const BOARD_RADIUS = WIDGET_RADIUS - PAD;
const CELL_RADIUS = BOARD_RADIUS - BOARD_PAD;
const TILE_HEIGHT_FACTORS = [0, 0.52, 0.5, 0.4, 0.31, 0.25];

function actionFill(colors: ThemeColors): ShapeStyle {
	return {
		gradient: 'linear',
		colors: [colors.action1, colors.action2, colors.action3, colors.action4].filter(Boolean),
		startPoint: 'top',
		endPoint: 'bottom',
	};
}

function rootFill(colors: ThemeColors): ShapeStyle {
	return {
		gradient: 'linear',
		colors: [colors.bgTop, colors.bgMid, colors.bgBottom],
		startPoint: 'topLeading',
		endPoint: 'bottomTrailing',
	};
}

function tileColor(colors: ThemeColors, value: number): Color {
	return colors[`tile${value}`] ?? colors.tileHigh;
}

function tileFill(colors: ThemeColors, value: number): ShapeStyle {
	return {gradient: 'linear', color: tileColor(colors, value)};
}

function tileInk(colors: ThemeColors, value: number): Color {
	return hexLuminance(tileColor(colors, value)) > 145 ? colors.ink : colors.inkLight;
}

function hexLuminance(color: Color): number {
	if (typeof color !== 'string') {
		return 0;
	}

	const hex = color.replace('#', '').padStart(6, '0');
	const red = Number.parseInt(hex.slice(0, 2), 16);
	const green = Number.parseInt(hex.slice(2, 4), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);
	return 0.299 * red + 0.587 * green + 0.114 * blue;
}

function widget(entry: WidgetEntry<EntryData>) {
	const layout = getLayoutMetrics(entry.size);
	const colors = themes[theme] ?? themes.Y2K;
	const sidebar = <SideRail state={entry} layout={layout} colors={colors}/>;
	const board = (
		<BoardView
			tiles={entry.renderTiles}
			gameOver={entry.gameOver}
			layout={layout}
			colors={colors}
		/>
	);

	return (
		<ZStack
			maxSides
			buttonStyle='borderless'
			background={rootFill(colors)}
			ignoresSafeArea
		>
			<VStack padding={layout.pad} maxSides>
				<HStack
					spacing={layout.gap}
					frame={{
						width: layout.contentWidth,
						height: layout.bodyHeight,
					}}
				>
					{padSide === 'LEFT' ? sidebar : board}
					{padSide === 'LEFT' ? board : sidebar}
				</HStack>
			</VStack>
		</ZStack>
	);
}

function getLayoutMetrics(size: Size): LayoutMetrics {
	const contentWidth = size.width - PAD * 2;
	const bodyHeight = size.height - PAD * 2;
	const boardWidth = contentWidth - SIDEBAR_WIDTH - GAP;
	const cellWidth =
		(boardWidth - BOARD_PAD * 2 - GAP * (GRID_SIZE - 1)) / GRID_SIZE;
	const cellHeight =
		(bodyHeight - BOARD_PAD * 2 - GAP * (GRID_SIZE - 1)) / GRID_SIZE;
	const innerWidth = cellWidth * GRID_SIZE + GAP * (GRID_SIZE - 1);
	const innerHeight = cellHeight * GRID_SIZE + GAP * (GRID_SIZE - 1);
	const unit = (bodyHeight - GAP * 2) / 4;

	return {
		pad: PAD,
		gap: GAP,
		contentWidth,
		bodyHeight,
		sidebarWidth: SIDEBAR_WIDTH,
		titleHeight: unit,
		scoreHeight: unit,
		newHeight: unit * 2,
		boardWidth,
		boardHeight: bodyHeight,
		boardRadius: BOARD_RADIUS,
		cellGap: GAP,
		cellWidth,
		cellHeight,
		cellRadius: CELL_RADIUS,
		innerWidth,
		innerHeight,
		stepX: cellWidth + GAP,
		stepY: cellHeight + GAP,
		originX: -innerWidth / 2 + cellWidth / 2,
		originY: -innerHeight / 2 + cellHeight / 2,
	};
}

function SideRail({
	state,
	layout,
	colors,
}: {
	state: EntryData;
	layout: LayoutMetrics;
	colors: ThemeColors;
}) {
	const width = layout.sidebarWidth;
	return (
		<VStack
			spacing={layout.gap}
			frame={{width, height: layout.bodyHeight}}
			zIndex={1}
		>
			<Button intent={app.reset()}>
				<ZStack frame={{width, height: layout.newHeight}}>
					<RoundedRectangle
						rectRadius={layout.boardRadius}
						fill={actionFill(colors)}
					/>
					<Text
						value='NEW'
						fontSize={40}
						fontWeight={900}
						fontDesign='rounded'
						foreground={colors.actionInk}
						lineLimit={1}
						minimumScaleFactor={0.1}
						padding={6}
					/>
				</ZStack>
			</Button>
			<ZStack frame={{width, height: layout.scoreHeight}}>
				<RoundedRectangle
					rectRadius={layout.boardRadius}
					fill={colors.card}
				/>
				<Text
					value={`${state.score}\n\n${state.best}`}
					fontSize={18}
					fontWeight={900}
					fontDesign='rounded'
					lineLimit={3}
					monospacedDigit
					contentTransition='numericText'
					textAlignment='center'
					overlay={<Capsule frame={{height: 3.5, width: 14}} rotationEffect={-60}/>}
					foreground={colors.scoreInk}
					minimumScaleFactor={0.1}
					padding={6}
				/>
			</ZStack>
			<ZStack frame={{width, height: layout.titleHeight}}>
				<RoundedRectangle
					rectRadius={layout.boardRadius}
					fill={colors.card}
				/>
				<Text
					value='2048'
					fontSize={24}
					fontWeight={900}
					fontDesign='rounded'
					foreground={colors.scoreInk}
					lineLimit={1}
					minimumScaleFactor={0.1}
					padding={6}
				/>
			</ZStack>
		</VStack>
	);
}

function BoardView({
	tiles,
	gameOver,
	layout,
	colors,
}: {
	tiles: RenderTile[];
	gameOver: boolean;
	layout: LayoutMetrics;
	colors: ThemeColors;
}) {
	const {innerWidth, innerHeight} = layout;

	return (
		<ZStack
			frame={{width: layout.boardWidth, height: layout.boardHeight}}
		>
			<RoundedRectangle
				rectRadius={layout.boardRadius}
				fill={colors.board}
			/>
			<VStack spacing={layout.cellGap}>
				{Array.from({length: GRID_SIZE}, () => (
					<HStack spacing={layout.cellGap}>
						{Array.from({length: GRID_SIZE}, () => (
							<RoundedRectangle
								rectRadius={layout.cellRadius}
								fill={colors.cell}
								frame={{
									width: layout.cellWidth,
									height: layout.cellHeight,
								}}
							/>
						))}
					</HStack>
				))}
			</VStack>
			<ZStack frame={{width: innerWidth, height: innerHeight}}>
				{sortRenderTiles(tiles).map(tile => (
					<TileView tile={tile} layout={layout} colors={colors}/>
				))}
			</ZStack>
			<BoardControls
				width={layout.boardWidth}
				height={layout.boardHeight}
			/>
			{gameOver
				? (
					<GameOverOverlay layout={layout} colors={colors}/>
				)
				: undefined}
		</ZStack>
	);
}

function BoardControls({
	width,
	height,
}: {
	width: number;
	height: number;
}) {
	const side = width;
	const x = (height - width) / 2;
	const offset = x / Math.sqrt(2);
	const offsetX = (padSide === 'LEFT' ? -1 : 1) * (width + GAP);
	return (
		<ZStack frame={{width, height}}>
			<HStack>
				<FullButton intent={app.move('left')}/>
				<FullButton intent={app.move('right')}/>
			</HStack>
			<ZStack
				sides={side}
				geometryGroup
				rotationEffect={45}
			>
				<ZStack offset={-offset}>
					<FullButton intent={app.move('up')} position={{x: 0, y: 0}}/>
					<FullButton intent={app.move('left')} position={{x: 0, y: side}}/>
					<FullButton intent={app.move('right')} position={{x: side, y: 0}}/>
				</ZStack>
				<ZStack offset={offset}>
					<FullButton intent={app.move('left')} position={{x: 0, y: side}}/>
					<FullButton intent={app.move('right')} position={{x: side, y: 0}}/>
					<FullButton intent={app.move('down')} position={{x: side, y: side}}/>
				</ZStack>
			</ZStack>
			<FullButton height={height + GAP * 2} offsetX={offsetX}/>
		</ZStack>
	);
}

function GameOverOverlay({
	layout,
	colors,
}: {
	layout: LayoutMetrics;
	colors: ThemeColors;
}) {
	return (
		<ZStack
			frame={{
				width: layout.boardWidth,
				height: layout.boardHeight,
			}}
			zIndex={OVERLAY_Z_INDEX}
		>
			<RoundedRectangle
				rectRadius={layout.boardRadius}
				fill={colors.scrim}
			/>
			<VStack spacing={2}>
				<Text
					value='GAME OVER'
					fontSize={24}
					fontWeight={900}
					fontDesign='rounded'
					foreground={colors.overlayInk}
					lineLimit={1}
				/>
			</VStack>
		</ZStack>
	);
}

function TileView({
	tile,
	layout,
	colors,
}: {
	tile: RenderTile;
	layout: LayoutMetrics;
	colors: ThemeColors;
}) {
	const {cellWidth, cellHeight, cellRadius, stepX, stepY, originX, originY} = layout;
	const offset = {
		x: originX + tile.x * stepX,
		y: originY + tile.y * stepY,
	};

	return (
		<ZStack
			frame={{width: cellWidth, height: cellHeight}}
			zIndex={tile.zIndex}
			geometryGroup
			offset={offset}
			opacity={tile.opacity}
			animation={{duration, type: 'smooth', value: offset}}
			id={tile.id}
		>
			<Text
				value={tile.value}
				fontSize={tileFontSize(tile.value, cellWidth, cellHeight)}
				fontWeight={900}
				fontDesign='rounded'
				foreground={tileInk(colors, tile.value)}
				lineLimit={1}
				minimumScaleFactor={0.1}
				padding={4}
				maxSides
				background={
					<RoundedRectangle
						rectRadius={cellRadius}
						fill={tileFill(colors, tile.value)}
					/>
				}
				contentTransition='numericText'
				animation={{duration, type: 'smooth', value: tile.value}}
				geometryGroup
				scaleEffect={tile.scale}
				animation_={{
					delay: duration,
					duration,
					type: 'smooth',
					value: tile.scale,
				}}
			/>
		</ZStack>
	);
}

function widgetTimeline(_context: TimelineContext): Timeline<EntryData> {
	const state = getCurrentState();
	AwaitStore.set('s', AwaitStore.num('s') + 1);
	return {
		entries: [
			{
				date: new Date(),
				...entryFromState(state),
			},
		],
	};
}

function entryFromState(state: GameState): EntryData {
	return {
		renderTiles: state.renderTiles,
		score: state.score,
		best: state.best,
		won: state.won,
		gameOver: state.gameOver,
	};
}

function tileFontSize(value: number, cellWidth: number, cellHeight: number) {
	const digits = String(value).length;
	const heightFactor = TILE_HEIGHT_FACTORS[digits] ?? 0.22;
	const widthBudget = cellWidth * 0.78;
	return Math.min(cellHeight * heightFactor, widthBudget / (digits * 0.62));
}

function makeTileId(): Encodable {
	return Math.random().toString();
}

function getCurrentState(): GameState {
	const currentValue = AwaitStore.get<GameState>(STORE_STATE_KEY);
	if (currentValue) {
		return currentValue;
	}

	const init = createInitialState();
	AwaitStore.set(STORE_STATE_KEY, init);
	return init;
}

function writeState(state: GameState) {
	AwaitStore.set(STORE_STATE_KEY, state);
}

function reset() {
	writeState(createInitialState(getCurrentState().best));
}

function move(direction: Direction) {
	const currentState = getCurrentState();
	const nextState = applyMove(currentState, direction);

	if (nextState !== currentState) {
		writeState(nextState);
	}
}

function createInitialState(best = 0): GameState {
	const nextTileId = makeTileId();
	const tiles = spawnRandomTile(spawnRandomTile([]));

	return {
		tiles,
		renderTiles: buildRenderTiles(tiles, nextTileId),
		nextTileId,
		score: 0,
		best: Math.max(best, 0),
		moves: 0,
		won: false,
		gameOver: false,
	};
}

function applyMove(state: GameState, direction: Direction) {
	if (state.gameOver) {
		return state;
	}

	const moveResult = moveTiles(state.tiles, direction);
	if (!moveResult.moved) {
		return state;
	}

	const score = state.score + moveResult.gained;
	const nextTiles = spawnRandomTile(moveResult.tiles, state.nextTileId);
	const nextTileId = makeTileId();

	return {
		tiles: nextTiles,
		renderTiles: buildRenderTiles(
			nextTiles,
			nextTileId,
			moveResult.ghostTiles,
			state.renderTiles,
		),
		nextTileId,
		score,
		best: Math.max(state.best, score),
		moves: state.moves + 1,
		won: state.won || nextTiles.some(tile => tile.value >= 2048),
		gameOver: !hasMoves(nextTiles),
	};
}

function moveTiles(tiles: Tile[], direction: Direction) {
	let isMoved = false;
	let gained = 0;
	const nextTiles: Tile[] = [];
	const ghostTiles: Tile[] = [];

	for (let lane = 0; lane < GRID_SIZE; lane += 1) {
		const lineResult = moveLine(
			getLineTiles(tiles, direction, lane),
			direction,
			lane,
		);
		isMoved ||= lineResult.moved;
		gained += lineResult.gained;
		nextTiles.push(...lineResult.tiles);
		ghostTiles.push(...lineResult.ghostTiles);
	}

	return {
		moved: isMoved,
		gained,
		tiles: nextTiles,
		ghostTiles,
	};
}

function getLineTiles(tiles: Tile[], direction: Direction, lane: number) {
	const isVertical = direction === 'up' || direction === 'down';
	const lineTiles = tiles.filter(tile => (isVertical ? tile.x : tile.y) === lane);
	const isTowardStart = direction === 'left' || direction === 'up';

	return lineTiles.toSorted((left, right) => {
		const leftAxis = isVertical ? left.y : left.x;
		const rightAxis = isVertical ? right.y : right.x;
		return isTowardStart ? leftAxis - rightAxis : rightAxis - leftAxis;
	});
}

function moveLine(lineTiles: Tile[], direction: Direction, lane: number) {
	const isTowardStart = direction === 'left' || direction === 'up';
	let targetAxis = isTowardStart ? 0 : GRID_SIZE - 1;
	let isMoved = false;
	let gained = 0;
	const tiles: Tile[] = [];
	const ghostTiles: Tile[] = [];

	for (let index = 0; index < lineTiles.length; index += 1) {
		const current = lineTiles[index];
		const next = lineTiles[index + 1];
		const tile = placeTile(current, direction, lane, targetAxis);
		isMoved ||= tileAxis(current, direction) !== targetAxis;

		if (current.value === next?.value) {
			tile.value *= 2;
			ghostTiles.push(placeTile(next, direction, lane, targetAxis));
			gained += tile.value;
			isMoved ||= tileAxis(next, direction) !== targetAxis;
			index += 1;
		}

		tiles.push(tile);
		targetAxis += isTowardStart ? 1 : -1;
	}

	return {
		moved: isMoved,
		gained,
		tiles,
		ghostTiles,
	};
}

function placeTile(
	tile: Tile,
	direction: Direction,
	lane: number,
	axis: number,
): Tile {
	const isVertical = direction === 'up' || direction === 'down';
	return {
		id: tile.id,
		value: tile.value,
		x: isVertical ? lane : axis,
		y: isVertical ? axis : lane,
	};
}

function tileAxis(tile: Tile, direction: Direction) {
	return direction === 'left' || direction === 'right' ? tile.x : tile.y;
}

function spawnRandomTile(tiles: Tile[], id = makeTileId()) {
	const occupied = new Set(tiles.map(tile => `${tile.x}:${tile.y}`));
	const emptyCells: Array<[number, number]> = [];

	for (let y = 0; y < GRID_SIZE; y += 1) {
		for (let x = 0; x < GRID_SIZE; x += 1) {
			if (!occupied.has(`${x}:${y}`)) {
				emptyCells.push([x, y]);
			}
		}
	}

	if (emptyCells.length === 0) {
		return sortTiles(tiles);
	}

	const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
	const tile: Tile = {
		id,
		value: Math.random() < 0.1 ? 4 : 2,
		x,
		y,
	};

	return sortTiles([...tiles, tile]);
}

function createRenderTile(tile: Tile, zIndex: number, scale = 1, opacity = 1): RenderTile {
	return {
		...tile,
		scale,
		opacity,
		zIndex,
	};
}

function buildRenderTiles(
	tiles: Tile[],
	nextTileId: Encodable,
	ghostTiles: Tile[] = [],
	previousRenderTiles: RenderTile[] = [],
) {
	const previousTiles = new Map(previousRenderTiles.map(tile => [tile.id, tile]));
	const currentTilesById = new Map([...ghostTiles, ...tiles].map(tile => [tile.id, tile]));
	const previousHostsByCell = new Map(previousRenderTiles
		.filter(tile => tile.zIndex >= TILE_Z_INDEX && tile.scale === 1)
		.map(tile => [`${tile.x}:${tile.y}`, tile] as const));
	const fadingGhostTiles: RenderTile[] = previousRenderTiles
		.filter(tile =>
			tile.zIndex === GHOST_TILE_Z_INDEX
			&& tile.opacity !== 0
			&& !currentTilesById.has(tile.id))
		.map(tile => {
			const host = previousHostsByCell.get(`${tile.x}:${tile.y}`);
			const target = host ? currentTilesById.get(host.id) : undefined;
			return createRenderTile(
				{
					...tile,
					x: target?.x ?? tile.x,
					y: target?.y ?? tile.y,
				},
				FADE_TILE_Z_INDEX,
				1,
				0,
			);
		});

	return sortRenderTiles([
		...fadingGhostTiles,
		...ghostTiles.map(tile => createRenderTile(tile, GHOST_TILE_Z_INDEX)),
		...tiles.map(tile =>
			createRenderTile(tile, previousTiles.get(tile.id)?.scale === 1 ? TILE_Z_INDEX : NEW_TILE_Z_INDEX)),
		createRenderTile({
			id: nextTileId,
			value: 2,
			x: 0,
			y: 0,
		}, NEW_TILE_Z_INDEX, 0),
	]);
}

function sortTiles(tiles: Tile[]) {
	return tiles.toSorted((left, right) => left.y - right.y || left.x - right.x);
}

function sortRenderTiles(tiles: RenderTile[]) {
	return tiles.toSorted((left, right) =>
		left.zIndex - right.zIndex || left.y - right.y || left.x - right.x);
}

function hasMoves(tiles: Tile[]) {
	if (tiles.length < GRID_SIZE * GRID_SIZE) {
		return true;
	}

	const board = Array.from({length: GRID_SIZE}, () =>
		Array.from({length: GRID_SIZE}, () => 0));
	for (const tile of tiles) {
		board[tile.y][tile.x] = tile.value;
	}

	for (let y = 0; y < GRID_SIZE; y += 1) {
		for (let x = 0; x < GRID_SIZE; x += 1) {
			const current = board[y][x];
			if (board[y]?.[x + 1] === current || board[y + 1]?.[x] === current) {
				return true;
			}
		}
	}

	return false;
}

const app = Await.define({
	widget,
	widgetFamilies: ['large'],
	widgetTimeline,
	widgetIntents: {
		move,
		reset,
	},
});
