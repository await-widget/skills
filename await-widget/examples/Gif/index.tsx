import {
	ZStack,
	Text,
	Gif,
} from 'await';

// @panel {type:'slider',min:1,max:60,step:1}
const length = 5;
// @panel {type:'slider',min:20,max:40,step:1}
const fontSize = 30;

function widget() {
	return (
		<ZStack maxSides background={0.5}>
			<Gif size={{width: 100, height: 100}} duration={2}>
				{Array.from({length}, (_, index) => (
					<Text
						value={(index + 1).toString().padStart(2, '0')}
						fontSize={fontSize}
						monospaced
						maxSides
						background={0.5}
						foreground={1}
					/>
				))}
			</Gif>
		</ZStack>
	);
}

Await.define({
	widget,
});
