import {
	Circle,
	FullButton,
	HStack,
	Rectangle,
	Spacer,
	Text,
	Time,
	VStack,
	ZStack,
} from 'await';

// @panel {type:'strings',min:0,title_zh:'事项',title_en:'Activities'}
const names: string[] = [
	'Snoozing',
	'Commuting',
	'Working',
	'Lunch',
	'Scrolling',
	'Gaming',
	'Binge-Watching',
	'Napping',
];
// @panel {type:'slider',min:0.8,max:1.2,step:0.01,title_zh:'项目字号比例',title_en:'Item font scale'}
const itemFontScale = 1;
// @panel {type:'menu',items:['红','蓝','紫','黄','绿','灰','透明'],title_zh:'纸张主题',title_en:'Paper theme'}
const theme = '黄';
// @panel {type:'slider',min:24,max:40,step:1,title_zh:'最小项目行高',title_en:'Minimum item row height'}
const minimumItemRowHeight = 30;
// @panel {type:'slider',min:44,max:80,step:1,title_zh:'大号表头高度',title_en:'Large header height'}
const largeHeaderHeight = 48;
// @panel {type:'slider',min:0,max:44,step:1,title_zh:'左右留白',title_en:'Side padding'}
const sidePadding = 16;
// @panel {type:'slider',min:0,max:20,step:1,title_zh:'单元留白',title_en:'Cell inset'}
const cellInset = 8;
// @panel {title_zh:'竖向分割线',title_en:'Column dividers'}
const showColumnRules = false;
// @panel {title_zh:'标题',title_en:'Title'}
const title = 'TIME RECEIPT';
// @panel {title_zh:'页脚文案',title_en:'Footer text'}
const footerText = 'COMMON HOUR CO.';
// @panel {title_zh:'序号列标题',title_en:'Number column label'}
const numberColumnLabel = 'NO.';
// @panel {title_zh:'事项列标题',title_en:'Activity column label'}
const activityColumnLabel = 'ACTIVITY';
// @panel {title_zh:'时间列标题',title_en:'Elapsed column label'}
const elapsedColumnLabel = 'ELAPSED';

const columnRatios: number[] = [1, 2, 2];

const palettes: Record<string, {paper?: Color; ink: Color}> = {
	红: {paper: '#ECA89F', ink: '#5A2E2D'},
	蓝: {paper: '#81BFE0', ink: '#123D52'},
	紫: {paper: '#B5A0E4', ink: '#3C2550'},
	黄: {paper: '#EFD08F', ink: '#62462E'},
	绿: {paper: '#9CCB9A', ink: '#26482F'},
	灰: {paper: '#BFBFBF', ink: '#3E3E3E'},
	透明: {ink: [1, 0.9]},
};
const {paper, ink} = palettes[theme];
const onInk = paper ?? 'background';
const spaceGrotesk = (fontSize: number, fontWeight: number): Font => ({
	name: 'Space Grotesk',
	size: fontSize,
	wght: fontWeight,
});

function widget(entry: WidgetEntry) {
	const {width, height} = entry.size;
	const small = entry.family === 'small';
	const compact = small || entry.family === 'medium';
	const grid = (steps: number) => steps * 4;
	const typeSize = (step: number) => 6.5 * 1.5 ** step;
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
	const itemFontSize = typeSize(2) * itemFontScale;
	const tableHeaderHeight = compact ? 0 : rowHeight * tableBandRatio + tableHeaderExtra;
	const footerHeight = rowHeight * tableBandRatio;
	const footerTop = height - footerHeight;
	const headerHeight = compact ? rowHeight : largeHeaderHeight;
	const headerRuleY = headerHeight;
	const rowTop = headerRuleY + tableHeaderHeight;
	const visibleNames = names.slice(0, rowCapacity);
	const tableHeaderY = (headerRuleY + rowTop) / 2;
	const tableLeft = margin;
	const tableWidth = contentWidth;
	const [numberRatio, nameRatio, timeRatio] = columnRatios;
	const columnUnit = tableWidth / (numberRatio + nameRatio + timeRatio);
	const numberDividerX = small ? tableLeft : tableLeft + columnUnit * numberRatio;
	const timeDividerX = tableLeft + (small ? tableWidth / 2 : columnUnit * (numberRatio + nameRatio));
	const numberCellWidth = numberDividerX - tableLeft;
	const nameCellWidth = timeDividerX - numberDividerX;
	const timeCellWidth = tableLeft + tableWidth - timeDividerX;
	const numberCellX = tableLeft + numberCellWidth / 2;
	const nameCellX = numberDividerX + nameCellWidth / 2;
	const timeCellX = timeDividerX + timeCellWidth / 2;
	const numberTextWidth = numberCellWidth - cellInset * 2;
	const nameTextWidth = nameCellWidth - cellInset * 2;
	const timeTextWidth = timeCellWidth - cellInset * 2;
	const itemDotSize = rowHeight * 0.16;
	const rowBoxHeight = rowHeight + 1;
	const headerTitleRow = small
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
		<ZStack frame={entry.size} background={paper}>
			<ZStack frame={{width: contentWidth, height: headerHeight}} position={{x: width / 2, y: headerHeight / 2}}>
				{headerTitleRow}
			</ZStack>
			{visibleNames.map((_, index) => (
				<Rectangle
					id={`active-row-${index}`}
					fill={ink}
					opacity={AwaitStore.num(`timeReceipt.start.${index}`, 0) > 0 ? 1 : 0}
					frame={{width: tableWidth, height: rowBoxHeight}}
					position={{x: width / 2, y: rowTop + rowHeight * (index + 0.5) - 0.5}}
				/>))}
			<Rectangle
				fill={ink}
				opacity={1}
				frame={{width: tableWidth, height: 1}}
				frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
				position={{x: width / 2, y: headerRuleY}}
			/>
			{compact
				? undefined
				: (
					<Rectangle
						fill={ink}
						opacity={0.35}
						frame={{width: tableWidth, height: 1}}
						frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
						position={{x: width / 2, y: rowTop}}
					/>
				)}
			{compact
				? undefined
				: (
					<Text
						value={numberColumnLabel}
						font={spaceGrotesk(typeSize(1), 700)}
						textAlignment='leading'
						foreground={ink}
						frame={{width: numberTextWidth, height: grid(3), alignment: 'leading'}}
						position={{x: numberCellX, y: tableHeaderY}}
					/>
				)}
			{compact
				? undefined
				: (
					<Text
						value={activityColumnLabel}
						font={spaceGrotesk(typeSize(1), 700)}
						textAlignment='leading'
						foreground={ink}
						frame={{width: nameTextWidth, height: grid(3), alignment: 'leading'}}
						position={{x: nameCellX, y: tableHeaderY}}
					/>
				)}
			{compact
				? undefined
				: (
					<Text
						value={elapsedColumnLabel}
						font={spaceGrotesk(typeSize(1), 700)}
						textAlignment='trailing'
						foreground={ink}
						frame={{width: timeTextWidth, height: grid(3), alignment: 'trailing'}}
						position={{x: timeCellX, y: tableHeaderY}}
					/>
				)}
			{Array.from({length: rowCapacity}, (_, index) => (
				<Rectangle
					id={`separator-${index}`}
					fill={ink}
					opacity={0.35}
					frame={{width: tableWidth, height: 1}}
					frame_={{width: tableWidth, height: 0, alignment: 'bottom'}}
					position={{x: width / 2, y: rowTop + rowHeight * (index + 1)}}
				/>))}
			{showColumnRules
				? (small ? [timeDividerX] : [numberDividerX, timeDividerX]).map((x, index) => (
					<Rectangle
						id={`column-rule-${index}`}
						fill={ink}
						opacity={0.35}
						frame={{width: 1, height: footerTop - headerRuleY}}
						position={{x, y: (headerRuleY + footerTop) / 2}}
					/>))
				: undefined}
			<Text
				value={footerText}
				font={spaceGrotesk(typeSize(0), 700)}
				textAlignment='center'
				foreground={ink}
				frame={{width: contentWidth, height: footerHeight, alignment: 'center'}}
				position={{x: width / 2, y: footerTop + footerHeight / 2}}
			/>
			{visibleNames.map((name, index) => {
				const start = AwaitStore.num(`timeReceipt.start.${index}`, 0);
				const elapsed = AwaitStore.num(`timeReceipt.elapsed.${index}`, 0);
				const active = start > 0;
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
							value={name}
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
									date={new Date(start)}
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
									value={formatElapsed(elapsed)}
									font={spaceGrotesk(itemFontSize, 700)}
									monospacedDigit
									textAlignment='trailing'
									foreground={ink}
									opacity={0.8}
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
			})}
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

	for (let other = 0; other < names.length; other++) {
		const otherStartKey = `timeReceipt.start.${other}`;
		const otherStart = AwaitStore.num(otherStartKey, 0);
		if (otherStart > 0) {
			AwaitStore.set(`timeReceipt.elapsed.${other}`, now - otherStart);
			AwaitStore.delete(otherStartKey);
		}
	}

	AwaitStore.set(`timeReceipt.elapsed.${index}`, 0);
	AwaitStore.set(currentStartKey, now);
}

const app = Await.define({
	widget,
	widgetFamilies: ['small', 'medium', 'large', 'extraLargePortrait'],
	widgetIntents: {toggle},
});
