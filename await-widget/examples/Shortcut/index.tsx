import {
	Button,
	Image,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel {title:'Text',title_zh:'文本'}
const value = 'Shortcut';
// @panel {title:'Background Image',title_zh:'背景图'}
const imageURL = '';
// @panel {type:'color',title:'Text Color',title_zh:'文本颜色'}
const foreground = 'fff';
// @panel {type:'slider',min:8,max:72,step:1,title:'Font Size',title_zh:'字体大小'}
const fontSize = 18;
// @panel {type:'slider',min:100,max:900,step:100,title:'Font Weight',title_zh:'字体粗细'}
const fontWeight = 600;
// @panel {type:'menu',items:['monospaced','rounded','serif','default'],title:'Font Design',title_zh:'字体风格'}
const fontDesign = 'monospaced';
// @panel {title:'Font URL',title_zh:'字体路径'}
const fontURL = '';
// @panel {type:'slider',min:0,max:32,step:1,title:'Padding',title_zh:'边距'}
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

function widget({size}: {size: Size}) {
	const content = (
		<ZStack frame={size}>
			<Image url={imageURL} resizable aspectRatio='fill' />
			<Text
				value={value}
				{...font}
				foreground={foreground}
				minimumScaleFactor={1 / fontSize}
				padding={padding}
				textAlignment='center'
			/>
		</ZStack>
	);
	return (
		<Button shortcut={0}>
			{fontURL === ''
				? (
					content
				)
				: (
					<Image resizable aspectRatio='fit'>
						{content}
					</Image>
				)}
		</Button>
	);
}

Await.define({
	widget,
});
