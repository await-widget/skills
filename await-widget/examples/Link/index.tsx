import {
	Button,
	Link,
	Text,
	VStack,
} from 'await';

// shortcuts://run-shortcut?name=YourShortcut

function widget() {
	return (
		<VStack spacing={16}>
			<Link url='shortcuts://'>
				<Text value='Shortcuts'/>
			</Link>
			<Button url='https://apple.com'>
				<Text value='Web'/>
			</Button>
		</VStack>
	);
}

Await.define({
	widget,
});
