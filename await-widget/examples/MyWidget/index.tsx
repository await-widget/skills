import {
	Button, Color, Text, VStack, ZStack,
} from 'await';

// @panel
const name = 'Await';
// @panel
const showBackground = true;
// @panel {type:'password}
const password = '12345678';
// @panel {type:'slider',min:8,max:64,step:1}
const fontSize = 16;
// @panel {type:'menu',items:['monospaced','rounded','serif','default']}
const fontDesign = 'default';
// @panel {type:'color'}
const foreground = 'ccc';
// @panel {type:'color'}
const background = '333';

function widget({value, size, family, date, colorScheme, renderingMode}: WidgetEntry<{value: number}>) {
	print(size, family, date, colorScheme, renderingMode, password.length);
	const text = `Hello, ${name}`;
	return (
		<ZStack>
			<Color value={showBackground ? background : ''}/>
			<VStack foreground={foreground} fontDesign={fontDesign}>
				<Text
					value={value}
					fontSize={fontSize}
					fontDesign={fontDesign}
				/>
				<Button intent={app.add(1)}>
					<Text
						value={text}
					/>
				</Button>
			</VStack>
		</ZStack>
	);
}

function widgetTimeline({size, family}: TimelineContext) {
	print(size, family);
	const value = AwaitStore.num('value');
	return {
		entries: [
			{date: new Date(), value},
		],
	};
}

function add(diff: number) {
	const value = AwaitStore.num('value');
	AwaitStore.set('value', value + diff);
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {add},
});
