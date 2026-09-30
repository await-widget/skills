import {
	Button,
	FullButton,
	ProgressView,
	Sector,
	Text,
	Time,
	ZStack,
	Circle,
	Modifier,
} from 'await';

// @panel {type:'strings',min:1,title:'Preset Durations',title_zh:'预设时长'}
const values: string[] = [
	'+',
	'25',
	'30',
	'40',
	'60',
	'90',
];
const colors: Color[] = values.map((_, index) => [
	1,
	values.length % 2 === 1 && index === values.length - 1 ? 0.25 : (index % 2 === 0 ? 0.2 : 0.3),
]);
// @panel {type:'slider',min:60,max:160,step:1,title:'Wheel Radius',title_zh:'转盘半径'}
const circleSize = 75;
// @panel {type:'slider',min:10,max:60,step:1,title:'Preset Font Size',title_zh:'选项字号'}
const presetSize = 20;
// @panel {type:'slider',min:10,max:60,step:1,title:'Timer Font Size',title_zh:'计时字号'}
const countdownSize = 40;
// @panel {type:'slider',min:10,max:60,step:2,title:'Center Size',title_zh:'中心大小'}
const buttonSize = 50;
// @panel {title:'Use Alarm',title_zh:'启用闹钟'}
const alarmEnabled = true;

const unit = Math.floor(circleSize * 2 / 3 / 2) * 2;
const buttonText = '⏰';

const selectedKey = 'selected';
const rotationKey = 'rotation';
const startKey = 'start';
const alarmIdKey = 'alarm-id';

const buttonStyle: CustomButtonStyle = {
	normal: <Modifier scaleEffect={1} animation={{type: 'spring', duration: 0.2, bounce: 0.5}}/>,
	press: <Modifier scaleEffect={1.2} animation={{type: 'spring', duration: 0.2, bounce: 0.5}}/>,
};

type Frame = {
	selected: number;
	phase: 'idle' | 'counting';
	start: number;
	deadline: number;
	rotation: number;
};

function minutes(index: number) {
	const value = Number(values[index]);
	return Number.isFinite(value) && value >= 0 ? value : 0;
}

function widgetTimeline(): Timeline<Frame> {
	const now = Date.now();
	const selected = AwaitStore.num(selectedKey, 0);
	const rotation = AwaitStore.num(rotationKey, 0);
	const start = AwaitStore.num(startKey, 0);
	const secondNow = Math.floor(now / 1000) * 1000;
	const duration = minutes(selected) * 60;

	if (!start) {
		return {
			entries: [{
				date: new Date(now), selected, phase: 'idle', start: 0, deadline: now + duration * 1000, rotation,
			}],
		};
	}

	const end = start + duration * 1000;
	return {
		entries: [{
			date: new Date(secondNow), selected, phase: 'counting', start,
			deadline: end, rotation,
		}],
	};
}

function sector(index: number, entry: WidgetEntry<Frame>) {
	const angle = 360 / values.length;
	const start = -90 - angle / 2 + index * angle + entry.rotation;
	return {start, angle};
}

function presetOrbit(index: number, entry: WidgetEntry<Frame>) {
	const angle = 360 / values.length;
	const start = -90 - angle / 2 + index * angle + entry.rotation;
	return start + angle / 2 + 90;
}

function widget(entry: WidgetEntry<Frame>) {
	const {phase} = entry;
	const active = phase !== 'idle';
	const circleSide = circleSize * 2;

	const activeView = (
		<ZStack id='preset'>
			<ProgressView
				value={[new Date(entry.start), new Date(entry.deadline)]}
				progressViewStyle='circular'
				sides={circleSize * 2}
				tint={1}
				background={0}
				compositingGroup
				luminanceToAlpha
				colorInvert
				opacity={0.2}
			/>
			<Time
				date={new Date(entry.deadline)}
				showsHours={minutes(entry.selected) === 0 ? undefined : false}
				fontSize={countdownSize}
				textAlignment='center'
				contentTransition='identity'
				minimumScaleFactor={1 / countdownSize}
				padding={25}
				sides={circleSize * 2}
				lineLimit={1}
			/>
		</ZStack>
	);

	const idleView = (
		<ZStack id='idle'>
			{values.map((value, index) => {
				const {start, angle} = sector(index, entry);
				const orbit = presetOrbit(index, entry);
				return (
					<ZStack id={`segment-${index}`}>
						<Sector
							id={`sector-${index}`}
							value={[0, angle]}
							fill={colors[index]}
							sides={circleSide}
							rotationEffect={start}
						/>
						<Button intent={app.choose(index)} offsetY={-unit} rotationEffect_={orbit}>
							<Text
								value={value}
								fontSize={presetSize}
								sides={unit}
								compositingGroup
								rotationEffect={-orbit}
							/>
						</Button>
					</ZStack>
				);
			})}
		</ZStack>
	);

	return (
		<ZStack
			textAlignment='center'
			foreground={1}
			fontDesign='rounded'
			monospacedDigit
			fontWeight={900}
			buttonStyle=''
		>
			{active ? activeView : idleView}
			{active
				? <FullButton intent={app.reset()} id='reset'/>
				: <Button intent={app.startTimer()} id='start' audio>
					<Circle sides={buttonSize} sides_={unit} overlay={<Text value={buttonText} fontSize={presetSize} foreground={0}/>}/>
				</Button>}
		</ZStack>
	);
}

function choose(index: number) {
	const rotation = AwaitStore.num(rotationKey, 0);
	const center = index * 360 / values.length + rotation;
	const delta = (((-center + 180) % 360) + 360) % 360 - 180;
	AwaitStore.set(rotationKey, rotation + delta);
	AwaitStore.set(selectedKey, index);
}

async function startTimer() {
	const previousAlarmId = AwaitStore.string(alarmIdKey, '');
	if (previousAlarmId) {
		AwaitAlarm.cancel(previousAlarmId);
	}

	AwaitStore.delete(alarmIdKey);
	AwaitStore.set(startKey, Math.floor(Date.now() / 1000) * 1000);
	const duration = minutes(AwaitStore.num(selectedKey, 0)) * 60;
	if (!alarmEnabled || duration === 0) {
		return;
	}

	const alarmId = await AwaitAlarm.schedule({duration});
	if (!alarmId) {
		return;
	}

	AwaitStore.set(alarmIdKey, alarmId);
}

function reset() {
	const alarmId = AwaitStore.string(alarmIdKey, '');
	if (alarmId) {
		AwaitAlarm.cancel(alarmId);
	}

	AwaitStore.delete(alarmIdKey);
	AwaitStore.set(startKey, 0);
}

const app = Await.define({
	widget, widgetTimeline, widgetIntents: {choose, startTimer, reset},
});
