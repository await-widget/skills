import {
	FullButton,
	Gif,
	Image,
	ZStack,
} from 'await';

const padding = 0;

function widget(entry: WidgetEntry) {
	const frames = AwaitFile.files('frames').toSorted();
	const side = Math.min(entry.size.width, entry.size.height) - padding * 2;
	const size = {width: side, height: side};
	return (
		<ZStack>
			<Gif size={size} duration={4} compositingGroup>
				{frames.map(file => (
					<Image
						url={`frames/${file}`}
						resizable
						accented='fullColor'
					/>
				))}
			</Gif>
			<FullButton shortcut={0}/>
		</ZStack>
	);
}

Await.define({
	widget,
	widgetFamilies: ['small'],
	autoAccented: false,
});
