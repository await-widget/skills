import {
	Button,
	Color,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel {title:'Button Text',title_zh:'按钮文本'}
const text = '+1';
// @panel {title:'Show Background',title_zh:'显示背景'}
const showBackground = true;
// @panel {type:'password',title:'Password',title_zh:'密码'}
const password = '12345678';
// @panel {type:'slider',min:8,max:72,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 36;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 800;
// @panel {type:'menu',items:['monospaced','rounded','serif','default'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'serif';
// @panel {type:'color',title:'Foreground',title_zh:'前景'}
const foreground = 'ccc';
// @panel {type:'color',title:'Background',title_zh:'背景'}
const background = '333';
// @panel {type:'strings',title:'List',title_zh:'列表'}
const array = [
	'One',
	'Two',
	'Three',
];

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
