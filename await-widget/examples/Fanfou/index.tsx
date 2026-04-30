import {
	Color,
	FullButton,
	HStack,
	Image,
	Spacer,
	Text,
	VStack,
	ZStack,
} from 'await';

// @panel {type:'password'}
const username = '';
// @panel {type:'password'}
const password = '';

type Content = Array<{text: string; url?: string}>;

function widget({name, content, image}: {name: string; content: Content; image?: string; id: string}) {
	return (
		<ZStack>
			<Color value='f'/>
			<VStack frame={{maxWidth: 'max', maxHeight: 'max', alignment: 'top'}}>
				<HStack maxWidth padding={{vertical: 8}} background='0cf'>
					<Spacer width={12}/>
					<Text value='饭否 fanfou.com' foreground={1} fontSize={12} fontWeight={800}/>
					<Spacer/>
				</HStack>
				<HStack alignment='top' padding={{horizontal: 12, vertical: 8}}>
					<Text {...font} tint={'06c'}>
						<Text foreground='06c' value={name}/>
						<Text foreground='0' value=' '/>
						{content.map(e => (<Text foreground={e.url ? '06c' : '0'} value={e.text}/>))}
					</Text>
					{image ? <><Spacer minLength={8}/><Image url={image} resizable aspectRatio='fit'/></> : undefined}
				</HStack>
			</VStack>
			<FullButton intent={app.post()}/>
			<FullButton url='https://m.fanfou.com/'/>
		</ZStack>
	);
}

const font: Mods = {
	fontSize: 64,
	fontWeight: 600,
	minimumScaleFactor: 1 / 64,
};

async function widgetTimeline() {
	const date = new Date();
	const parameters = {count: 1, format: 'html', mode: 'lite'};

	const res = await AwaitNetwork.fanfou('https://api.fanfou.com/statuses/home_timeline.json', {
		parameters, username, password,
	}) as [{text: string; user: {name: string}; photo?: {imageurl: string}; id: string}] ?? [{ text: '', user: { name: '' }, id: '' }];;
	const feed = res[0];
	const {name} = feed.user;
	const {text, id} = feed;
	const image = feed.photo?.imageurl;
	const content = parseString(text);

	return {
		entries: [{
			date, name, content, image, id,
		}], update: date,
	};
}

function parseString(input: string): Content {
	const regex = /(@?#?)<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>(#?)/g;
	const result = [];
	let lastIndex = 0;
	let match;
	while ((match = regex.exec(input)) !== null) {
		if (match.index > lastIndex) {
			result.push({text: input.slice(lastIndex, match.index)});
		}

		const [_, prefix, url, content, suffix] = match;
		result.push({text: `${prefix}${content}${suffix}`, url});
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < input.length) {
		result.push({text: input.slice(lastIndex)});
	}

	return result;
}

async function post() {
	// await AwaitNetwork.fanfou('https://api.fanfou.com/photos/upload.json', {
	// 	parameters: {status: 'image post'}, oauthToken, oauthTokenSecret, method: 'POST', image: 'image-in-folder.png',
	// });
	// await AwaitNetwork.fanfou('https://api.fanfou.com/statuses/update.json', {
	// 	parameters: {status: 'text'}, oauthToken, oauthTokenSecret, method: 'POST',
	// });
}

const app = Await.define({
	widget,
	widgetTimeline,
	widgetIntents: {
		post,
	},
});
