import {
	HStack,
	ZStack,
	Image,
	FullButton,
} from 'await';

type EntryData = {
	index: number;
};

// @panel {type:'menu',items:[30,60,90,120],title:'自动刷新分钟'}
const changeTime = 60;
// @panel {type:'menu',items:['fit','fill'],title:'填充模式'}
const mode = 'fill';
// @panel {title:'开启动画'}
const withAnimation = true;
// @panel {type:'slider',min:0,max:2,title:'动画时长',step:0.01}
const duration = 0.4;

function widget({size, index}: WidgetEntry<EntryData>) {
	const files = [...AwaitFile.files('images')].toSorted((a, b) =>
		a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base',
		}));

	const count = files.length;
	const loop = 5;

	const mod = (value: number, length: number) => ((value % length) + length) % length;

	const images = Array.from({length: loop}, (_, offset) => files[mod(index + offset, count)]);
	const ids = Array.from({length: loop}, (_, offset) => mod(index + offset, loop));
	const opacities = [0, 1, 1, 1, 0];

	const content = withAnimation
		? (
			<HStack
				width={size.width * loop}
				frame={size}
				contentShape='none'
				animation={{type: duration > 0 ? 'spring' : 'linear', duration}}
			>
				{images.map((image, i) => (
					<Image
						url={`images/${image}`}
						resizable
						aspectRatio={mode}
						frame={size}
						clipped
						opacity={opacities[i]}
						id={ids[i]}
					/>
				))}
			</HStack>
		)
		: (
			<Image
				url={`images/${images[2]}`}
				resizable
				aspectRatio={mode}
				transition='blurReplace'
				id={images[2]}
			/>
		);

	return (
		<ZStack>
			{content}
			<HStack>
				<FullButton intent={app.change(-1)} />
				<FullButton intent={app.change(1)} />
			</HStack>
		</ZStack>
	);
}

function change(diff: number) {
	const index = AwaitStore.num('index');
	AwaitStore.set('index', index + diff);
	AwaitStore.set('ttl', Date.now());
}

function widgetTimeline() {
	let index = AwaitStore.num('index');
	if (Date.now() - AwaitStore.num('ttl') > 500) {
		index += 1;
		AwaitStore.set('index', index);
		AwaitStore.set('ttl', Date.now());
	}

	const entries = [
		{
			date: new Date(),
			index,
		},
	];
	return {
		entries,
		update: new Date(Date.now() + changeTime * 60 * 1000),
	};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {change},
});
