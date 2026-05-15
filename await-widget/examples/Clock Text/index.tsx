import {
	HStack, Image, Text, Ticker, ZStack,
} from 'await';

const height = 54;
const unitWidth = 58;
const secondWidth = 58;
const separatorWidth = 14;
const fontSize = 42;

// @panel {type:'color'}
const accent = '#D93025';

const ink = {
	light: '#202124',
	dark: '#E8EAED',
};

function widget({date}: {date: Date}) {
	const hour = pad(date.getHours());
	const minute = pad(date.getMinutes());

	return (
		<HStack spacing={0} alignment='center' height={height}>
			<TimeText value={hour}/>
			<Separator/>
			<TimeText value={minute}/>
			<Separator/>
			<SecondText/>
		</HStack>
	);
}

function TimeText({value}: {value: string}) {
	return (
		<Text
			value={value}
			width={unitWidth}
			height={height}
			foreground={ink}
			fontSize={fontSize}
			fontWeight='bold'
			fontDesign='rounded'
			monospacedDigit
			textAlignment='center'
		/>
	);
}

function Separator() {
	return (
		<Text
			value=':'
			width={separatorWidth}
			height={height}
			foreground={ink}
			fontSize={fontSize}
			fontWeight='bold'
			fontDesign='rounded'
			textAlignment='center'
		/>
	);
}

function SecondText() {
	return (
		<Ticker style='second' size={{width: secondWidth, height}}>
			{Array.from({length: 60}).map((_, i) => <Image url={`assets/${i}.png`}/>)}
		</Ticker>
	);
}

function preRender() {
	if (AwaitEnv.host !== 'app') {
		return;
	}

	for (let i = 0; i < 60; i++) {
		AwaitFile.saveUIRenderImage(
			`assets/${i}.png`, (
				<ZStack frame={{width: secondWidth, height}}>
					<Text
						value={pad(i)}
						foreground={accent}
						fontSize={fontSize}
						fontWeight='bold'
						fontDesign='rounded'
						monospacedDigit
						textAlignment='center'
					/>
				</ZStack>
			),
		);
	}
}

function pad(value: number) {
	return value.toString().padStart(2, '0');
}

preRender();

function widgetTimeline() {
	const time = (new Date()).setSeconds(0, 0);
	const entries = [];

	for (let i = 0; i <= 15; i += 1) {
		entries.push({
			date: new Date(time + 1000 * 60 * i),
		});
	}

	return {entries, update: 'rapid' as const};
}

Await.define({
	widget,
	widgetTimeline,
});
