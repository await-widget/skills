import {
	FullButton,
	Image,
	Text,
	ZStack,
} from 'await';

// @panel {type:'strings',min:1,title:'Text',title_zh:'文本'}
const value = [
	'Shortcut',
];
// @panel {type:'strings',min:1,title:'Background Image',title_zh:'背景图'}
const imageURL = [
	'',
];
// @panel {type:'color',title:'Text Color',title_zh:'文本颜色'}
const foreground = 'fff';
// @panel {type:'slider',min:8,max:72,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 17;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 600;
// @panel {type:'menu',items:['monospaced','rounded','serif','default'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'monospaced';
// @panel {title:'Font URL',title_zh:'字体路径'}
const fontURL = '';
// @panel {type:'menu',items:['center','leading','trailing'],title:'Text Alignment',title_zh:'文字对齐'}
const textAlignment = 'center';
// @panel {type:'slider',min:-16,max:32,step:1,title:'Padding',title_zh:'边距'}
const padding = 16;

const font: Mods =
	fontURL === ''
		? {
			fontSize,
			fontWeight,
			fontDesign,
		}
		: {
			font: {url: fontURL, size: fontSize, wght: fontWeight},
		};

function Quote({size}: {size?: Size}) {
	const content = (
		<Text
			value={value[AwaitEnv.tag - 1]}
			{...font}
			textAlignment={textAlignment}
			foreground={foreground}
			frame={size}
		/>
	);
	return fontURL === '' ? content : <Image accented='fullColor'>{content}</Image>;
}

function widget({size}: {size: Size}) {
	const contentSize = {width: size.width - padding * 2, height: size.height - padding * 2};
	return (
		<ZStack>
			<Image accented='fullColor' url={imageURL[AwaitEnv.tag - 1]} resizable aspectRatio='fill' />
			<Quote size={contentSize}/>
			<FullButton shortcut={0}/>
		</ZStack>
	);
}

Await.define({
	widget,
	autoAccented: false,
});
