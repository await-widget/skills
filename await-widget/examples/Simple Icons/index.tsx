import {
	ZStack,
	Svg,
	FullButton,
} from 'await';

function widget(entry: {icon: string}) {
	const {icon} = entry;
	return (
		<ZStack>
			<Svg url={`https://cdn.simpleicons.org/${icon}`} padding={{vertical: 16}}/>
			<FullButton/>
		</ZStack>
	);
}

function widgetTimeline() {
	const icons = AwaitFile.readJSON('simple-icons.json') as Array<{slug: string}>;
	const icon = icons[Math.floor(Math.random() * icons.length)]!.slug;
	return {update: 'rapid' as const, entries: [{date: new Date(), icon}]};
}

Await.define({
	widget,
	widgetTimeline,
});

