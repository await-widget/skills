import {
	FullButton,
	Text,
	VStack,
	YFlip,
	ZStack,
} from 'await';
import {parseDeck, type Card} from './deck';

// @panel {title:'Deck File',title_zh:'卡库文件'}
const deckPath = 'kana.csv';

const {cards} = parseDeck(String(AwaitFile.readText(deckPath)), deckPath);
const prefix = `flashcards.${deckPath}.`;
const initializedKey = `${prefix}initialized`;
const currentKey = `${prefix}current`;
const previousKey = `${prefix}previous`;
const revealedKey = `${prefix}revealed`;
const previousRevealedKey = `${prefix}previousRevealed`;
const flipIndexKey = `${prefix}flipIndex`;

function randomIndex(excluding?: number) {
	if (cards.length === 1) {
		return 0;
	}

	const index = Math.floor(Math.random() * (cards.length - (excluding === undefined ? 0 : 1)));
	return excluding !== undefined && index >= excluding ? index + 1 : index;
}

function initializeTraining() {
	if (AwaitStore.bool(initializedKey)) {
		return;
	}

	const index = randomIndex();
	AwaitStore.set(currentKey, index);
	AwaitStore.set(previousKey, index);
	AwaitStore.set(revealedKey, false);
	AwaitStore.set(previousRevealedKey, false);
	AwaitStore.set(flipIndexKey, 0);
	AwaitStore.set(initializedKey, true);
}

function widget({size, renderingMode}: WidgetEntry) {
	initializeTraining();
	const background = renderingMode === 'fullColor' ? 1 : '';
	const foreground = renderingMode === 'fullColor' ? 0 : 1;
	const index = AwaitStore.num(currentKey);
	const previousIndex = AwaitStore.num(previousKey);
	const answer = AwaitStore.bool(revealedKey);
	const previousAnswer = AwaitStore.bool(previousRevealedKey);
	return (
		<ZStack foreground={foreground} animation={{type: 'smooth', duration: 0.6}}>
			<YFlip
				index={AwaitStore.num(flipIndexKey)}
				curr={<CardFace card={cards[index]} index={index} answer={answer} size={size} background={background}/>}
				prev={<CardFace card={cards[previousIndex]} index={previousIndex} answer={previousAnswer} size={size} background={background}/>}
			/>
			<FullButton intent={answer ? app.next() : app.flip()} maxSides />
		</ZStack>
	);
}

function flip() {
	AwaitStore.set(previousKey, AwaitStore.num(currentKey));
	AwaitStore.set(previousRevealedKey, false);
	AwaitStore.set(revealedKey, true);
	AwaitStore.set(flipIndexKey, AwaitStore.num(flipIndexKey) + 1);
}

function next() {
	const current = AwaitStore.num(currentKey);
	AwaitStore.set(previousKey, current);
	AwaitStore.set(previousRevealedKey, true);
	AwaitStore.set(currentKey, randomIndex(current));
	AwaitStore.set(revealedKey, false);
	AwaitStore.set(flipIndexKey, AwaitStore.num(flipIndexKey) + 1);
}

function CardFace({card, index, answer, size, background}: {card: Card; index: number; answer: boolean; size: Size; background: Color}) {
	return (
		<VStack
			padding={16}
			frame={size}
			background={background}
			cornerRadius={86 / 3}
			id={index}
			transition='identity'
		>
			<Text
				value={answer ? card.back : card.front}
				fontSize={48}
				fontWeight={700}
				textAlignment='center'
				minimumScaleFactor={0.1}
			/>
		</VStack>
	);
}

function widgetTimeline(): Timeline {
	initializeTraining();
	return {entries: [{date: new Date()}], update: 'never'};
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetFamilies: ['small'],
	widgetIntents: {flip, next},
});
