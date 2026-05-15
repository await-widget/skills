import {
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

const tone = {
	background: '171528',
	foreground: 'F7F4FF',
	accent: 'C1B2FF',
	muted: 'D9CEF6',
	subtle: 'B2A7D8',
};

type EntryData = {
	count: number;
	title: string;
	time: string;
	calendar: string;
};

// @panel {type:'slider',min:0.5,max:2}
const fontScale = 1;
// @panel
const showLabel = true;

function widget(entry: WidgetEntry<EntryData>) {
	const children: NativeView[] = [
		showLabel
			? <Text
				id='label'
				value='Calendar'
				fontSize={11}
				fontWeight={700}
				foreground={tone.accent}
				lineLimit={1}
			/>
			: undefined,
		<Text
			id='count'
			value={`${entry.count} event${entry.count === 1 ? '' : 's'}`}
			fontSize={25 * fontScale}
			fontWeight={800}
			lineLimit={1}
			minimumScaleFactor={0.72}
			contentTransition='numericText'
		/>,
		<Text
			id='title'
			value={entry.title}
			fontSize={14}
			fontWeight={700}
			lineLimit={2}
			minimumScaleFactor={0.74}
		/>,
		<Text
			id='time'
			value={entry.time}
			fontSize={11}
			fontWeight={600}
			foreground={tone.muted}
			lineLimit={1}
			minimumScaleFactor={0.75}
		/>,
	];
	if (entry.calendar) {
		children.push(<Text
			id='calendar'
			value={entry.calendar}
			fontSize={10}
			fontWeight={600}
			foreground={tone.subtle}
			lineLimit={1}
			minimumScaleFactor={0.75}
		/>);
	}
	return (
		<ZStack maxSides>
			<Color value={tone.background}/>
			<VStack spacing={8} padding={16} foreground={tone.foreground} fontDesign='rounded'>
				{children}
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline<EntryData>> {
	const now = new Date();
	const events = await AwaitCalendar.get({limit: 3});
	if (events === undefined) {
		return {
			entries: [{
				date: now,
				count: 0,
				title: 'Unable to access calendar',
				time: 'Check permission',
				calendar: '',
			}],
			update: new Date(Date.now() + 1_800_000),
		};
	}
	const first = events[0];
	return {
		entries: [{
			date: now,
			count: events.length,
			title: first?.title ?? 'No upcoming event',
			time: first?.startDate === undefined ? 'Next month' : formatMonthDayTime(new Date(first.startDate)),
			calendar: first?.calendarTitle ?? 'Calendar',
		}],
		update: new Date(Date.now() + 1_800_000),
	};
}

function pad2(value: number) {
	return value.toString().padStart(2, '0');
}

function formatMonthDayTime(date: Date) {
	return `${date.getMonth() + 1}/${date.getDate()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

Await.define({
	widget,
	widgetTimeline,
});
