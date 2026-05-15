import {
	Button,
	Capsule,
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

const tone = {
	background: '261512',
	foreground: 'FFF7F3',
	accent: 'F6B38A',
	muted: 'EBC1A3',
	buttonFill: 'E9824B',
	buttonForeground: 'FFF7F3',
};

// @panel {type:'slider',min:5,max:20,step:1}
const duration = 8;
// @panel {type:'slider',min:0.5,max:2}
const fontScale = 1;
// @panel
const showLabel = true;

const alarmIdStoreKey = 'alarm';

function widget() {
	return (
		<ZStack maxSides>
			<Color value={tone.background}/>
			<VStack spacing={6} padding={16} foreground={tone.foreground} fontDesign='rounded'>
				{showLabel
					? <Text
						value='Alarm'
						fontSize={11}
						fontWeight={700}
						foreground={tone.accent}
						lineLimit={1}
					/>
					: undefined}
				<Text
					value={duration}
					fontSize={30 * fontScale}
					fontWeight={800}
					lineLimit={1}
					minimumScaleFactor={0.72}
					contentTransition='numericText'
				/>
				<Text
					value={'seconds later'}
					fontSize={11}
					fontWeight={600}
					foreground={tone.muted}
					lineLimit={1}
					minimumScaleFactor={0.75}
				/>
				<Button intent={app.schedule()} buttonStyle='borderless' audio>
					<Text
						value='Schedule'
						fontSize={11}
						fontWeight={800}
						foreground={tone.buttonForeground}
						lineLimit={1}
						minimumScaleFactor={0.75}
						padding={{horizontal: 12, vertical: 7}}
						background={tone.buttonFill}
						clipShape={<Capsule/>}
					/>
				</Button>
			</VStack>
		</ZStack>
	);
}

const app = Await.define({
	widget,
	widgetIntents: {
		async schedule() {
			const alarmId = AwaitStore.string(alarmIdStoreKey);
			AwaitAlarm.cancel(alarmId);
			const result = await AwaitAlarm.schedule({title: 'Time waits for no one', duration});
			AwaitStore.set(alarmIdStoreKey, result);
		},
	},
});
