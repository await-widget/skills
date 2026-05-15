import {
	Capsule, Image, Rectangle, Ticker, VStack, ZStack,
} from 'await';

// @panel {type:'color'}
const accent = '#D93025';
const inkLight = '#202124';
const inkDark = '#E8EAED';
const mutedLight = '#5F6368';
const mutedDark = '#BDC1C6';
const hourLength = 40;
const minuteLength = 56;
const secondLength = 60;
const unit = 144;

const ink = {
	light: inkLight,
	dark: inkDark,
};
const muted = {
	light: mutedLight,
	dark: mutedDark,
};

function widget({date}: {date: Date}) {
	return (
		<ZStack sides={unit}>
			<HourHand date={date}/>
			<MinuteHand date={date}/>
			<SecondHand/>
		</ZStack>
	);
}

function HourHand({date}: {date: Date}) {
	const angle = ((date.getHours() % 12) + date.getMinutes() / 60) * 30;
	return <Hand angle={angle} length={hourLength} width={15} fill={ink}/>;
}

function MinuteHand({date}: {date: Date}) {
	const angle = (date.getMinutes() + date.getSeconds() / 60) * 6;
	return <Hand angle={angle} length={minuteLength} width={10} fill={muted}/>;
}

function SecondHand() {
	return (
		<Ticker style='second' size={{width: unit, height: unit}}>
			{Array.from({length: 60}).map((_, i) => <Image url={`assets/${i}.png`}/>)}
		</Ticker>
	);
}

function Hand({angle, length, width, fill}: {angle: number; length: number; width: number; fill: string | {light: string; dark: string}}) {
	const cap = width / 2;
	return (
		<VStack width={width} rotationEffect={angle} sides={unit}>
			<Rectangle height={unit / 2 - length} fill=''/>
			<Capsule height={length + cap} fill={fill}/>
			<Rectangle height={unit / 2 - cap} fill=''/>
		</VStack>
	);
}

function SecondNeedle({angle}: {angle: number}) {
	return (
		<VStack width={4} rotationEffect={angle} sides={unit}>
			<Rectangle height={unit / 2 - secondLength} fill=''/>
			<Capsule height={secondLength} fill={accent}/>
			<Rectangle height={unit / 2} fill=''/>
		</VStack>
	);
}

function preRender() {
	for (let i = 0; i < 60; i++) {
		AwaitFile.saveUIRenderImage(
			`assets/${i}.png`, (
				<SecondNeedle angle={6 * i}/>
			),
		);
	}
}

preRender();

function widgetTimeline() {
	const entries = [];
	for (let i = 0; i <= 15; i += 1) {
		entries.push({
			date: new Date((new Date()).setSeconds(0, 0) + 1000 * 60 * i),
		});
	}
	return {entries, update: 'rapid' as const};
}

Await.define({
	widget,
	widgetTimeline,
});
