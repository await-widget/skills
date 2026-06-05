import { ZStack, Image } from 'await';

// @panel
const url = 'sample.jpg';

function widget() {
	return (
		<ZStack>
			<Image url={url} resizable aspectRatio='fill'/>
		</ZStack>
	);
}

Await.define({
	widget,
});
