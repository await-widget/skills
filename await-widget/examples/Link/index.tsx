import {
	Button,
	Link,
	Text,
	VStack,
} from 'await';

function widget() {
	return (
		<VStack spacing={16}>
			<Link url='maps://?q=coffee'>
				<Text value='Deeplink: Coffee Map'/>
			</Link>
			<Button url='https://apple.com'>
				<Text value='URL: Website'/>
			</Button>
			<Button intent={app.launch('com.apple.AppStore')}>
				<Text value='Launch: App Store'/>
			</Button>
		</VStack>
	);
}

function launch(id: string) {
	AwaitLaunch.start(id);
}

const app = Await.define({
	widget,
	widgetIntents: {launch},
});
