import {
	Button,
	Color,
	HStack,
	Rectangle,
	Spacer,
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
	outer: number;
	gap: number;
	headerHeight: number;
	headerWidth: number;
	boardSide: number;
	titleSize: number;
	statusSize: number;
	statWidth: number;
	resetWidth: number;
};
type EntryData = {
	renderTiles: RenderTile[];
	score: number;
	best: number;
	moves: number;
	won: boolean;
	gameOver: boolean;
	openCells: number;
};
type GameState = {
	tiles: Tile[];
	renderTiles: RenderTile[];
	nextTileId: Encodable;
	score: number;
	best: number;
	moves: number;
	won: boolean;
	gameOver: boolean;
};
type StoredGameState = GameState;

const duration = 0.15;
const GRID_SIZE = 4;
const STORE_STATE_KEY = 'g';
const TILE_Z_INDEX = 2;
const NEW_TILE_Z_INDEX = 3;
const GHOST_TILE_Z_INDEX = 1;
const FADE_TILE_Z_INDEX = 0;
const ROOT_FILL: LinearGradient = {
	gradient: 'linear',
	colors: ['FAF8EF', 'F3EEE4'],
	startPoint: 'top',
	endPoint: 'bottom',
};
const BOARD_FILL = 'BBADA0';
const EMPTY_FILL = 'CDC1B4';
const ACTION_FILL = '8F7A66';
const ACTION_FOREGROUND = 'F9F6F2';
const TEXT_PRIMARY = '776E65';
const TEXT_MUTED = '8A8178';

function makeTileId(): Encodable {
	return Math.random().toString();
}

function widget(entry: WidgetEntry<EntryData>) {
	const small = entry.size.width < 200 || entry.size.height < 200;
	const layout = getLayoutMetrics(small, entry.size);
	return (
		<VStack padding={layout.outer} maxSides buttonStyle='borderless' background={ROOT_FILL}>
			{small ? undefined : <HeaderBar state={entry} layout={layout}/>}
			<BoardView tiles={entry.renderTiles} side={layout.boardSide}/>
		</VStack>
	);
}

function getLayoutMetrics(small: boolean, size: Size): LayoutMetrics {
	const outer = small ? 0 : 12;
	const gap = small ? 2 : 6;
	const headerHeight = small ? 0 : 30;
	const innerWidth = size.width - outer * 2;
	const innerHeight = size.height - outer * 2;
	const maxBoardSide = Math.max(0, Math.min(innerWidth, innerHeight - headerHeight - gap));
	const {boardSide} = getBoardMetrics(maxBoardSide);
	return {
		outer,
		gap,
		headerHeight,
		headerWidth: boardSide,
		boardSide,
		titleSize: 22,
		statusSize: 10,
		statWidth: 48,
		resetWidth: 48,
	};
}

function getBoardMetrics(maxSide: number) {
	const maxGap = Math.floor(maxSide / (GRID_SIZE + 1));
	const preferredGap = Math.max(4, Math.ceil(maxSide * 0.04));
	const gap = Math.min(preferredGap, maxGap);
	const cellSide = Math.ceil((maxSide - gap * (GRID_SIZE + 1)) / GRID_SIZE);
	const innerSide = cellSide * GRID_SIZE + gap * (GRID_SIZE - 1);
	const boardSide = innerSide + gap * 2;
	return {
		boardSide,
		gap,
		innerSide,
		cellSide,
	};
}

function HeaderBar({state, layout}: {state: EntryData; layout: LayoutMetrics}) {
	return (
		<HStack frame={{width: layout.headerWidth, height: layout.headerHeight}} spacing={layout.gap} padding={{bottom: layout.gap}}>
			<VStack alignment='leading' spacing={0}>
				<Text
					value='2048'
					fontSize={layout.titleSize}
					fontWeight={900}
					foreground={TEXT_PRIMARY}
					lineLimit={1}
					minimumScaleFactor={0.1}
				/>
				<Text
					value={headerStatus(state)}
					fontSize={layout.statusSize}
					fontWeight={700}
					foreground={TEXT_MUTED}
					lineLimit={1}
					minimumScaleFactor={0.1}
				/>
			</VStack>
			<Spacer/>
			<StatCard label='S' value={state.score} width={layout.statWidth} height={layout.headerHeight}/>
			<StatCard label='B' value={state.best} width={layout.statWidth} height={layout.headerHeight}/>
			<CompactButton label='NEW' intent={app.reset()} width={layout.resetWidth} height={layout.headerHeight}/>
		</HStack>
	);
}

function BoardView({tiles, side}: {tiles: RenderTile[]; side: number}) {
	const {boardSide, gap, innerSide, cellSide} = getBoardMetrics(side);
	return (
		<ZStack frame={{width: boardSide, height: boardSide}} zIndex={-1}>
			<Rectangle fill={BOARD_FILL}/>
			<VStack frame={{width: innerSide, height: innerSide}} spacing={gap}>
				{Array.from({length: GRID_SIZE}, _ => (
					<HStack spacing={gap}>
						{Array.from({length: GRID_SIZE}, _ => (
							<Rectangle fill={EMPTY_FILL} frame={{width: cellSide, height: cellSide}}/>
						))}
					</HStack>
				))}
			</VStack>
			<ZStack frame={{width: innerSide, height: innerSide}}>
				{sortRenderTiles(tiles).map(tile => (
					<TileView
						tile={tile}
						side={cellSide}
						gap={gap}
						innerSide={innerSide}
					/>
				))}
			</ZStack>
			<BoardControls/>
		</ZStack>
	);
}

function BoardControls() {
	return (
		<VStack geometryGroup scaleEffect={2} rotationEffect={45}>
			<HStack>
				<Button intent={app.move('up')}><Color value=''/></Button>
				<Button intent={app.move('right')}><Color value=''/></Button>
			</HStack>
			<HStack>
				<Button intent={app.move('left')}><Color value=''/></Button>
				<Button intent={app.move('down')}><Color value=''/></Button>
			</HStack>
		</VStack>
	);
}

function TileView({
	tile,
	side,
	gap,
	innerSide,
}: {
	tile: RenderTile;
	side: number;
	gap: number;
	innerSide: number;
}) {
	const step = side + gap;
	const origin = -innerSide / 2 + side / 2;
	const offset = {
		x: origin + tile.x * step,
		y: origin + tile.y * step,
	};
	return (
		<ZStack
			frame={{width: side, height: side}}
			zIndex={tile.zIndex}
			geometryGroup
			offset={offset}
			opacity={tile.opacity}
			animation={{duration, type: 'smooth', value: offset}}
			id={tile.id}
		>
			<Text
				value={tile.value}
				fontSize={tileFontSize(tile.value, side)}
				fontWeight={900}
				foreground={tileForeground(tile.value)}
				lineLimit={1}
				minimumScaleFactor={0.1}
				maxSides
				background={tileFill(tile.value)}
				contentTransition='numericText'
				animation={{duration, type: 'smooth', value: tile.value}}
				geometryGroup
				scaleEffect={tile.scale}
				animation_={{
					delay: duration, duration, type: 'smooth', value: tile.scale,
				}}
			/>
		</ZStack>
	);
}

function StatCard({
	label,
	value,
	width,
	height,
}: {
	label: string;
	value: number;
	width: number;
	height: number;
}) {
	return (
		<ZStack frame={{width, height}}>
			<Rectangle fill={BOARD_FILL}/>
			<VStack spacing={1}>
				<Text
					value={label}
					fontSize={9}
					fontWeight={700}
					foreground={ACTION_FOREGROUND}
					lineLimit={1}
				/>
				<Text
					value={value}
					fontSize={Math.min(height * 0.48, 22)}
					fontWeight={900}
					foreground={ACTION_FOREGROUND}
					lineLimit={1}
					minimumScaleFactor={0.1}
				/>
			</VStack>
		</ZStack>
	);
}

function CompactButton({
	label,
	intent,
	width,
	height,
}: {
	label: string;
	intent: IntentInfo;
	width: number;
	height: number;
}) {
	return (
		<Button intent={intent}>
			<ZStack frame={{width, height}}>
				<Rectangle fill={ACTION_FILL}/>
				<Text
					value={label}
					fontSize={Math.min(height * 0.48, 22)}
					fontWeight={800}
					foreground={ACTION_FOREGROUND}
					lineLimit={1}
					minimumScaleFactor={0.1}
				/>
			</ZStack>
		</Button>
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
		moves: state.moves,
		won: state.won,
		gameOver: state.gameOver,
		openCells: countEmpty(state.tiles),
	};
}

function headerStatus(state: EntryData) {
	if (state.gameOver) {
		return 'STUCK';
	}

	if (state.won) {
		return `WIN ${state.openCells}`;
	}

	return `MOVE ${state.moves} · ${state.openCells} OPEN`;
}

function tileFill(value: number): Color {
	switch (value) {
		case 2: {
			return 'EEE4DA';
		}
		case 4: {
			return 'EDE0C8';
		}
		case 8: {
			return 'F2B179';
		}
		case 16: {
			return 'F59563';
		}
		case 32: {
			return 'F67C5F';
		}
		case 64: {
			return 'F65E3B';
		}
		case 128: {
			return 'EDCF72';
		}
		case 256: {
			return 'EDCC61';
		}
		case 512: {
			return 'EDC850';
		}
		case 1024: {
			return 'EDC53F';
		}
		case 2048: {
			return 'EDC22E';
		}
		default: {
			return '3C3A32';
		}
	}
}

function tileForeground(value: number): Color {
	return value <= 4 ? TEXT_PRIMARY : ACTION_FOREGROUND;
}

function tileFontSize(value: number, side: number) {
	const digits = String(value).length;

	if (digits <= 2) {
		return side * 0.38;
	}

	if (digits === 3) {
		return side * 0.3;
	}

	if (digits === 4) {
		return side * 0.22;
	}

	return side * 0.18;
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
	AwaitStore.set(STORE_STATE_KEY, normalizeState(state));
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
	let tiles: Tile[] = [];
	const nextTileId = makeTileId();

	tiles = spawnRandomTile(tiles);
	tiles = spawnRandomTile(tiles);

	return {
		tiles,
		renderTiles: buildRenderTiles(tiles, nextTileId),
		nextTileId,
		score: 0,
		best,
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
	const best = Math.max(state.best, score);
	const nextTiles = spawnRandomTile(moveResult.tiles, state.nextTileId);
	const nextTileId = makeTileId();

	return normalizeState({
		tiles: nextTiles,
		renderTiles: buildRenderTiles(nextTiles, nextTileId, moveResult.ghostTiles, state.renderTiles),
		nextTileId,
		score,
		best,
		moves: state.moves + 1,
		won: state.won,
		gameOver: false,
	});
}

function moveTiles(tiles: Tile[], direction: Direction) {
	let moved = false;
	let gained = 0;
	const nextTiles: Tile[] = [];
	const ghostTiles: Tile[] = [];

	for (let lane = 0; lane < GRID_SIZE; lane += 1) {
		const lineResult = moveLine(getLineTiles(tiles, direction, lane), direction, lane);
		moved ||= lineResult.moved;
		gained += lineResult.gained;
		nextTiles.push(...lineResult.tiles);
		ghostTiles.push(...lineResult.ghostTiles);
	}

	return {
		moved,
		gained,
		tiles: sortTiles(nextTiles),
		ghostTiles: sortTiles(ghostTiles),
	};
}

function getLineTiles(tiles: Tile[], direction: Direction, lane: number) {
	const vertical = direction === 'up' || direction === 'down';
	const lineTiles = tiles.filter(tile => (vertical ? tile.x === lane : tile.y === lane));
	const towardStart = direction === 'left' || direction === 'up';

	return [...lineTiles].sort((left, right) => {
		const leftAxis = vertical ? left.y : left.x;
		const rightAxis = vertical ? right.y : right.x;
		return towardStart ? leftAxis - rightAxis : rightAxis - leftAxis;
	});
}

function moveLine(lineTiles: Tile[], direction: Direction, lane: number) {
	const towardStart = direction === 'left' || direction === 'up';
	let targetAxis = towardStart ? 0 : GRID_SIZE - 1;
	let moved = false;
	let gained = 0;
	const tiles: Tile[] = [];
	const ghostTiles: Tile[] = [];

	for (let index = 0; index < lineTiles.length; index += 1) {
		const current = lineTiles[index]!;
		const next = lineTiles[index + 1];

		if (current.value === next?.value) {
			const survivor = placeTile(current, direction, lane, targetAxis);
			const merged = {
				...survivor,
				value: current.value * 2,
			};
			const ghost = placeTile(next, direction, lane, targetAxis);

			tiles.push(merged);
			ghostTiles.push(ghost);
			gained += merged.value;
			moved ||= tileAxis(current, direction) !== targetAxis || tileAxis(next, direction) !== targetAxis;
			index += 1;
		} else {
			const tile = placeTile(current, direction, lane, targetAxis);
			tiles.push(tile);
			moved ||= tileAxis(current, direction) !== targetAxis;
		}

		targetAxis += towardStart ? 1 : -1;
	}

	return {
		moved,
		gained,
		tiles,
		ghostTiles,
	};
}

function placeTile(tile: Tile, direction: Direction, lane: number, axis: number): Tile {
	if (direction === 'left' || direction === 'right') {
		return {
			id: tile.id,
			value: tile.value,
			x: axis,
			y: lane,
		};
	}

	return {
		id: tile.id,
		value: tile.value,
		x: lane,
		y: axis,
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

	const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)]!;
	const tile: Tile = {
		id,
		value: Math.random() < 0.1 ? 4 : 2,
		x,
		y,
	};

	return sortTiles([...tiles, tile]);
}

function buildRenderTiles(
	tiles: Tile[],
	nextTileId: Encodable,
	ghostTiles: Tile[] = [],
	previousRenderTiles: RenderTile[] = [],
) {
	const previousTiles = new Map(previousRenderTiles.map(tile => [tile.id, tile]));
	const activeTileIds = new Set(tiles.map(tile => tile.id));
	const activeGhostIds = new Set(ghostTiles.map(tile => tile.id));
	const currentTiles = [...ghostTiles, ...tiles];
	const currentTilesById = new Map(currentTiles.map(tile => [tile.id, tile]));
	const previousHostsByCell = new Map(previousRenderTiles
		.filter(tile => tile.zIndex >= TILE_Z_INDEX && tile.scale === 1)
		.map(tile => [`${tile.x}:${tile.y}`, tile] as const));
	const createRenderTile = (
		tile: Tile,
		options: {
			scale: number;
			opacity: number;
			zIndex: number;
		},
	): RenderTile => ({
		...tile,
		scale: options.scale,
		opacity: options.opacity,
		zIndex: options.zIndex,
	});
	const fadingGhostTiles: RenderTile[] = previousRenderTiles
		.filter(tile => (
			tile.zIndex === GHOST_TILE_Z_INDEX
			&& tile.opacity !== 0
			&& !activeTileIds.has(tile.id)
			&& !activeGhostIds.has(tile.id)
		))
		.map(tile => {
			const host = previousHostsByCell.get(`${tile.x}:${tile.y}`);
			const target = host ? currentTilesById.get(host.id) : undefined;
			return createRenderTile({
				...tile,
				x: target?.x ?? tile.x,
				y: target?.y ?? tile.y,
			}, {
				scale: 1,
				opacity: 0,
				zIndex: FADE_TILE_Z_INDEX,
			});
		});
	const existingTiles: RenderTile[] = [
		...fadingGhostTiles,
		...ghostTiles.map(tile => createRenderTile(tile, {
			scale: 1,
			opacity: 1,
			zIndex: GHOST_TILE_Z_INDEX,
		})),
		...tiles.map(tile => createRenderTile(tile, {
			scale: 1,
			opacity: 1,
			zIndex: previousTiles.get(tile.id)?.scale === 1
				? TILE_Z_INDEX
				: NEW_TILE_Z_INDEX,
		})),
	];
	const reservedTile = createRenderTile({
		id: nextTileId,
		value: 2,
		x: 0,
		y: 0,
	}, {
		zIndex: NEW_TILE_Z_INDEX,
		scale: 0,
		opacity: 1,
	});

	return sortRenderTiles([...existingTiles, reservedTile]);
}

function sortTiles(tiles: Tile[]) {
	return [...tiles].sort((left, right) => (
		left.y - right.y
		|| left.x - right.x
	));
}

function sortRenderTiles(tiles: RenderTile[]) {
	return [...tiles].sort((left, right) => (
		left.zIndex - right.zIndex
		|| left.y - right.y
		|| left.x - right.x
	));
}

function countEmpty(tiles: Tile[]) {
	return GRID_SIZE * GRID_SIZE - tiles.length;
}

function hasWinningTile(tiles: Tile[]) {
	return tiles.some(tile => tile.value >= 2048);
}

function hasMoves(tiles: Tile[]) {
	if (tiles.length < GRID_SIZE * GRID_SIZE) {
		return true;
	}

	const board = boardFromTiles(tiles);

	for (let y = 0; y < GRID_SIZE; y += 1) {
		for (let x = 0; x < GRID_SIZE; x += 1) {
			const current = board[y]![x]!;
			if (board[y]?.[x + 1] === current || board[y + 1]?.[x] === current) {
				return true;
			}
		}
	}

	return false;
}

function boardFromTiles(tiles: Tile[]) {
	const board = Array.from({length: GRID_SIZE}, () => Array.from({length: GRID_SIZE}, () => 0));

	for (const tile of tiles) {
		board[tile.y]![tile.x] = tile.value;
	}

	return board;
}

function normalizeState(state: StoredGameState): GameState {
	const tiles = sortTiles(state.tiles);
	const renderTiles = sortRenderTiles(state.renderTiles);

	return {
		...state,
		tiles,
		renderTiles,
		nextTileId: state.nextTileId,
		best: Math.max(state.best, state.score),
		won: state.won || hasWinningTile(tiles),
		gameOver: !hasMoves(tiles),
	};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		move,
		reset,
	},
});
