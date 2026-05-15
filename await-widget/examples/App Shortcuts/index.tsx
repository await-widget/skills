import {
	Button,
	Color,
	HStack,
	Text,
	UnevenRoundedRectangle,
	VStack,
	ZStack,
} from 'await';

// @panel
const showBackground = true;

// @panel {type:'color'}
const background = '333';

type AppItem = {
	name: string;
	identifier: string;
	color: string;
};

const apps: AppItem[] = [
	{name: 'Alipay', identifier: 'com.alipay.iphoneclient', color: '1677FF'},
	{name: 'Bilibili', identifier: 'tv.danmaku.bilianime', color: 'FB7299'},
	{name: 'Taobao', identifier: 'com.taobao.taobao4iphone', color: 'FF5000'},
	{name: 'WeChat', identifier: 'com.tencent.xin', color: '07C160'},
	{name: 'Xiaohongshu', identifier: 'com.xingin.discover', color: 'FF2442'},
	{name: 'App Store', identifier: 'com.apple.AppStore', color: '0A84FF'},
	{name: 'Calendar', identifier: 'com.apple.mobilecal', color: 'FF3B30'},
	{name: 'Camera', identifier: 'com.apple.camera', color: '444444'},
	{name: 'Clock', identifier: 'com.apple.mobiletimer', color: '111111'},
	{name: 'FaceTime', identifier: 'com.apple.facetime', color: '22C55E'},
	{name: 'Files', identifier: 'com.apple.DocumentsApp', color: '2563EB'},
	{name: 'Health', identifier: 'com.apple.Health', color: 'EF4444'},
	{name: 'Mail', identifier: 'com.apple.mobilemail', color: '0A84FF'},
	{name: 'Maps', identifier: 'com.apple.Maps', color: '22C55E'},
	{name: 'Messages', identifier: 'com.apple.MobileSMS', color: '30D158'},
	{name: 'Music', identifier: 'com.apple.Music', color: 'FA2D48'},
	{name: 'Notes', identifier: 'com.apple.mobilenotes', color: 'FACC15'},
	{name: 'Phone', identifier: 'com.apple.mobilephone', color: '34C759'},
	{name: 'Photos', identifier: 'com.apple.mobileslideshow', color: 'F97316'},
	{name: 'Reminders', identifier: 'com.apple.reminders', color: '60A5FA'},
	{name: 'Safari', identifier: 'com.apple.mobilesafari', color: '147EFB'},
	{name: 'Settings', identifier: 'com.apple.Preferences', color: '6B7280'},
	{name: 'Shortcuts', identifier: 'com.apple.shortcuts', color: '8B5CF6'},
	{name: 'Wallet', identifier: 'com.apple.Passbook', color: '111827'},
	{name: 'Weather', identifier: 'com.apple.weather', color: '3B82F6'},
];

function widget({size}: WidgetEntry) {
	const gap = size.width < 220 ? 7 : 9;
	const inset = size.width < 220 ? 11 : 14;
	const columns = size.width < 220 ? 3 : (size.width < 330 ? 4 : 5);
	const side = Math.floor((size.width - inset * 2 - gap * (columns - 1)) / columns);
	const rows = Math.max(1, Math.floor((size.height - inset * 2 + gap) / (side + gap)));
	const shown = apps.slice(0, columns * rows);
	const appRows = Array.from({length: Math.ceil(shown.length / columns)}, (_, index) => shown.slice(index * columns, index * columns + columns));
	const outerRadius = 86 / 3 - inset;
	const innerRadius = Math.max(8, side * 0.2);

	return (
		<ZStack>
			<Color value={showBackground ? background : ''}/>
			<VStack maxSides spacing={gap} padding={inset}>
				{appRows.map((row, rowIndex) => (
					<HStack spacing={gap}>
						{row.map((item, columnIndex) => {
							const firstRow = rowIndex === 0;
							const lastRow = rowIndex === appRows.length - 1;
							const firstColumn = columnIndex === 0;
							const lastColumn = columnIndex === row.length - 1;

							return (
								<Button intent={app.launch(item.identifier)} buttonStyle='borderless'>
									<ZStack
										sides={side}
										background={item.color}
										clipShape={(
											<UnevenRoundedRectangle rectRadius={{
												topLeft: firstRow && firstColumn ? outerRadius : innerRadius,
												topRight: firstRow && lastColumn ? outerRadius : innerRadius,
												bottomRight: lastRow && lastColumn ? outerRadius : innerRadius,
												bottomLeft: lastRow && firstColumn ? outerRadius : innerRadius,
											}}/>
										)}
									>
										<Text value={item.name} fontSize={12} fontWeight={800} monospaced foreground='fff'/>
									</ZStack>
								</Button>
							);
						})}
					</HStack>
				))}
			</VStack>
		</ZStack>
	);
}

function launch(identifier: string) {
	AwaitLaunch.start(identifier);
}

const app = Await.define({
	widget,
	widgetIntents: {launch},
});
