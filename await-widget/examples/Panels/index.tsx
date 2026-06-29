import {
	Button, Color, Text, VStack, ZStack,
} from 'await';

// @panel
const text = '+1';
// @panel
const showBackground = true;
// @panel {type:'password'}
const password = '12345678';
// @panel {type:'slider',min:8,max:72,step:1}
const fontSize = 36;
// @panel {type:'slider',min:100,max:900,step:100}
const fontWeight = 600;
// @panel {type:'menu',items:['monospaced','rounded','serif','default']}
const fontDesign = 'default';
// @panel {type:'color'}
const foreground = 'ccc';
// @panel {type:'color'}
const background = '333';

function widget({value}: {value: number}) {
	return (
		<ZStack>
			<Color value={showBackground ? background : ''}/>
			<VStack spacing={8} foreground={foreground} fontDesign={fontDesign} fontWeight={fontWeight}>
				<Text
					value={value}
					fontSize={fontSize}
					contentTransition='numericText'
				/>
				<Button intent={app.add(1)}>
					<Text value={text}/>
				</Button>
			</VStack>
		</ZStack>
	);
}

function widgetTimeline() {
	const value = AwaitStore.num('value');
	return {
		entries: [
			{date: new Date(), value},
		],
	};
}

// @panel {title:'+1'}
function add1() {
	const value = AwaitStore.num('value');
	AwaitStore.set('value', value + 1);
}

function add(diff: number) {
	const value = AwaitStore.num('value');
	AwaitStore.set('value', value + diff);
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {add, add1},
});
