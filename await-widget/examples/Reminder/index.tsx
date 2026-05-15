import {
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

const tone = {
	background: '221910',
	foreground: 'FFF7EC',
	accent: 'F2B36F',
	muted: 'F3D7B5',
	subtle: 'D0AE84',
};

type EntryData = {
	count: number;
	title: string;
	due?: string;
	list: string;
};

// @panel {type:'slider',min:0.5,max:2}
const fontScale = 1;
// @panel
const showLabel = true;

function widget(entry: WidgetEntry<EntryData>) {
	const children: NativeView[] = [
		showLabel
			? <Text
				id='count'
				value={`${entry.count} open`}
				fontSize={25 * fontScale}
				fontWeight={800}
				lineLimit={1}
				minimumScaleFactor={0.72}
				contentTransition='numericText'
			/>
			: undefined,
		<Text
			id='title'
			value={entry.title}
			fontSize={14}
			fontWeight={700}
			lineLimit={2}
			minimumScaleFactor={0.74}
		/>,
	];
	if (entry.due) {
		children.push(<Text
			id='due'
			value={entry.due}
			fontSize={11}
			fontWeight={600}
			foreground={tone.muted}
			lineLimit={1}
			minimumScaleFactor={0.75}
		/>);
	}
	if (entry.list) {
		children.push(<Text
			id='list'
			value={entry.list}
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
	const reminders = await AwaitReminder.get({limit: 3});
	if (reminders === undefined) {
		return {
			entries: [{
				date: new Date(),
				count: 0,
				title: 'Unable to load reminders',
				due: undefined,
				list: '',
			}],
			update: new Date(Date.now() + 1_800_000),
		};
	}
	const first = reminders[0];
	return {
		entries: [{
			date: new Date(),
			count: reminders.length,
			title: first?.title ?? 'No open reminder',
			due: first?.dueDate === undefined ? undefined : formatMonthDayTime(new Date(first.dueDate)),
			list: first?.calendarTitle ?? 'Reminders',
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
