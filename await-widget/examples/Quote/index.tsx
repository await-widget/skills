import {Text, Image} from 'await';

// @panel {title:'Text',title_zh:'文本'}
const value = 'To give us new colors to see';
// @panel {type:'color',title:'Text Color',title_zh:'文本颜色'}
const foreground = 'fff';
// @panel {type:'slider',min:8,max:72,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 17;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 600;
// @panel {type:'menu',items:['monospaced','rounded','serif','default'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'serif';
// @panel {title:'Font URL',title_zh:'字体路径'}
const fontURL = '';
// @panel {type:'menu',items:['center','leading','trailing'],title:'Text Alignment',title_zh:'文字对齐'}
const textAlignment = 'leading';
// @panel {type:'slider',min:0,max:32,step:1,title:'Padding',title_zh:'边距'}
const padding = 0;

const font: Mods = fontURL === ''
	? {
		fontSize,
		fontWeight,
		fontDesign,
	}
	: {
		font: {url: fontURL, size: fontSize, wght: fontWeight},
	};

function widget({size}: WidgetEntry) {
	const content = <Text
		value={value}
		minimumScaleFactor={1 / fontSize}
		textAlignment={textAlignment}
		{...font}
		padding={padding}
		frame={size}
		foreground={foreground}
	/>;
	return fontURL === '' ? content : <Image resizable aspectRatio='fit'>{content}</Image>;
}

Await.define({widget});
