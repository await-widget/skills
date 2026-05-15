import {
	Color,
	HStack,
	RoundedRectangle,
	VStack,
	ZStack,
} from 'await';

type ContributionLevel
	= | 'NONE'
		| 'FIRST_QUARTILE'
		| 'SECOND_QUARTILE'
		| 'THIRD_QUARTILE'
		| 'FOURTH_QUARTILE';

type CommitDay = {
	date: string;
	contributionCount: number;
	level: ContributionLevel;
};

type CommitWeek = Array<CommitDay | undefined>;

type EntryData = {
	status: 'ok' | 'error';
	login: string;
	avatarUrl: string;
	totalContributions: number;
	streak: number;
	updatedAt: string;
	weeks: CommitWeek[];
	message: string;
};

type Layout = {
	padding: Padding;
	cellSide: number;
	cellGap: number;
	cellRadius: number;
};

const HEATMAP_COLORS: Record<ContributionLevel, Color> = {
	NONE: '161B22',
	FIRST_QUARTILE: '0E4429',
	SECOND_QUARTILE: '006D32',
	THIRD_QUARTILE: '26A641',
	FOURTH_QUARTILE: '39D353',
};

const login = 'maundytime';

function widget(entry: WidgetEntry<EntryData>) {
	const size = {width: entry.size.width - 24, height: entry.size.height - 24};
	const layout = getLayout(size, entry.weeks.length);
	return (
		<ZStack maxSides>
			<Color value='0D1117'/>
			<VStack maxSides padding={layout.padding}>
				<Heatmap weeks={entry.weeks} layout={layout}/>
			</VStack>
		</ZStack>
	);
}

function Heatmap({weeks, layout}: {weeks: CommitWeek[]; layout: Layout}) {
	return (
		<HStack spacing={layout.cellGap}>
			{weeks.map(week => (
				<VStack spacing={layout.cellGap}>
					{week.map(day => (
						day
							? (
								<RoundedRectangle
									sides={layout.cellSide}
									rectRadius={layout.cellRadius}
									fill={HEATMAP_COLORS[day.level]}
								/>
							)
							: <Color value='0D1117' sides={layout.cellSide}/>
					))}
				</VStack>
			))}
		</HStack>
	);
}

async function widgetTimeline(context: TimelineContext): Promise<Timeline<EntryData>> {
	const {family} = context;
	const visibleWeeks = visibleWeeksForFamily(family);
	const now = new Date();
	const visibleStart = visibleRangeStart(now, visibleWeeks);
	const visibleEnd = startOfDay(now);
	const years = contributionYearsInRange(visibleStart, visibleEnd);
	const pages = await Promise.all(years.map(async year => {
		const res = await AwaitNetwork.request(contributionsYearURL(login, year), {
			headers: {
				Accept: 'text/html,application/xhtml+xml',
				'User-Agent': 'AwaitWidget',
			},
		});
		return res.data;
	}));
	const days = mergeContributionDays(pages.map(page => parseContributionDays(page)));
	const visibleDays = filterContributionDays(days, visibleStart, visibleEnd);
	return {
		entries: [{
			date: now,
			status: 'ok',
			login,
			avatarUrl: avatarURL(login),
			totalContributions: totalContributions(visibleDays),
			streak: currentStreak(visibleDays, now),
			updatedAt: formatTime(now),
			weeks: buildVisibleWeeks(days, visibleWeeks, now),
			message: '',
		}],
		update: new Date(Date.now() + 3_600_000),
	};
}

function getLayout(size: Size, weekCount: number): Layout {
	const columns = Math.max(1, weekCount);
	const rows = 7;
	const cellGap = 2;
	const cellSide = Math.floor(Math.max(
		1,
		Math.min(
			(size.width - cellGap * (columns - 1)) / columns,
			(size.height - cellGap * (rows - 1)) / rows,
		),
	));
	const contentWidth = cellSide * columns + cellGap * (columns - 1);
	const contentHeight = cellSide * rows + cellGap * (rows - 1);
	return {
		padding: {
			left: Math.max(0, Math.floor((size.width - contentWidth) / 2)),
			right: Math.max(0, Math.floor((size.width - contentWidth) / 2)),
			top: Math.max(0, Math.floor((size.height - contentHeight) / 2)),
			bottom: Math.max(0, Math.floor((size.height - contentHeight) / 2)),
		},
		cellSide,
		cellGap,
		cellRadius: Math.max(1.5, Math.min(4, cellSide / 4)),
	};
}

function visibleWeeksForFamily(family: WidgetFamily): number {
	if (family === 'small') {
		return 7;
	}

	if (family === 'medium') {
		return 18;
	}

	return 18;
}

function emptyWeek(): CommitWeek {
	return Array.from({length: 7}, (): CommitDay | undefined => undefined);
}

function contributionsURL(login: string, from: Date, to: Date): string {
	return `https://github.com/users/${login}/contributions?from=${formatDate(from)}&to=${formatDate(to)}`;
}

function contributionsYearURL(login: string, year: number): string {
	return contributionsURL(login, new Date(year, 0, 1), new Date(year, 11, 31));
}

function avatarURL(login: string): string {
	return `https://github.com/${login}.png?size=80`;
}

function parseContributionDays(html: string): CommitDay[] {
	const byDate = new Map<string, CommitDay>();
	const regex = /data-date="(\d{4}-\d{2}-\d{2})"([^>]*)>/g;

	while (true) {
		const match = regex.exec(html);
		if (match === null) {
			break;
		}

		const date = match[1]!;
		const attrs = match[2] ?? '';
		const count = parseContributionCount(attrs);
		const level = parseContributionLevel(attrs, count);
		byDate.set(date, {
			date,
			contributionCount: count ?? estimatedContributionCount(level),
			level,
		});
	}

	return [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date));
}

function mergeContributionDays(groups: CommitDay[][]): CommitDay[] {
	const byDate = new Map<string, CommitDay>();
	for (const days of groups) {
		for (const day of days) {
			byDate.set(day.date, day);
		}
	}

	return [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date));
}

function parseContributionCount(attrs: string): number | undefined {
	const dataCount = (/data-count="(\d+)"/.exec(attrs))?.[1];
	if (dataCount !== undefined) {
		return Number(dataCount);
	}

	const label = (/(?:aria-label|title)="([^"]+)"/.exec(attrs))?.[1];
	if (!label) {
		return undefined;
	}

	if (/no contributions?/i.test(label)) {
		return 0;
	}

	const labelCount = (/(\d+)\s+contributions?/i.exec(label))?.[1];
	if (labelCount !== undefined) {
		return Number(labelCount);
	}

	return undefined;
}

function parseContributionLevel(attrs: string, contributionCount: number | undefined): ContributionLevel {
	const rawLevel = (/data-level="(\d)"/.exec(attrs))?.[1];
	if (rawLevel !== undefined) {
		return levelFromNumber(Number(rawLevel));
	}

	return levelFromCount(contributionCount ?? 0);
}

function levelFromNumber(level: number): ContributionLevel {
	if (level <= 0) {
		return 'NONE';
	}

	if (level === 1) {
		return 'FIRST_QUARTILE';
	}

	if (level === 2) {
		return 'SECOND_QUARTILE';
	}

	if (level === 3) {
		return 'THIRD_QUARTILE';
	}

	return 'FOURTH_QUARTILE';
}

function levelFromCount(count: number): ContributionLevel {
	if (count <= 0) {
		return 'NONE';
	}

	if (count <= 3) {
		return 'FIRST_QUARTILE';
	}

	if (count <= 6) {
		return 'SECOND_QUARTILE';
	}

	if (count <= 9) {
		return 'THIRD_QUARTILE';
	}

	return 'FOURTH_QUARTILE';
}

function estimatedContributionCount(level: ContributionLevel): number {
	if (level === 'NONE') {
		return 0;
	}

	if (level === 'FIRST_QUARTILE') {
		return 3;
	}

	if (level === 'SECOND_QUARTILE') {
		return 6;
	}

	if (level === 'THIRD_QUARTILE') {
		return 9;
	}

	return 12;
}

function buildVisibleWeeks(days: CommitDay[], visibleWeeks: number, now: Date): CommitWeek[] {
	const dayMap = new Map(days.map(day => [day.date, day] as const));
	const today = startOfDay(now);
	const currentWeekStart = addDays(today, -today.getDay());
	const weeks: CommitWeek[] = [];

	for (let weekOffset = visibleWeeks - 1; weekOffset >= 0; weekOffset--) {
		const weekStart = addDays(currentWeekStart, -weekOffset * 7);
		const week = emptyWeek();

		for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
			const date = addDays(weekStart, dayOffset);
			if (date.getTime() > today.getTime()) {
				continue;
			}

			const key = formatDate(date);
			week[dayOffset] = dayMap.get(key) ?? {
				date: key,
				contributionCount: 0,
				level: 'NONE',
			};
		}

		weeks.push(week);
	}

	return weeks;
}

function filterContributionDays(days: CommitDay[], from: Date, to: Date): CommitDay[] {
	const fromKey = formatDate(from);
	const toKey = formatDate(to);
	return days.filter(day => day.date >= fromKey && day.date <= toKey);
}

function totalContributions(days: CommitDay[]): number {
	return days.reduce((sum, day) => sum + day.contributionCount, 0);
}

function currentStreak(days: CommitDay[], now: Date): number {
	let streak = 0;
	const dayMap = new Map(days.map(day => [day.date, day.contributionCount] as const));
	for (let date = startOfDay(now); ; date = addDays(date, -1)) {
		const count = dayMap.get(formatDate(date)) ?? 0;
		if (count <= 0) {
			break;
		}

		streak++;
	}

	return streak;
}

function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function visibleRangeStart(now: Date, visibleWeeks: number): Date {
	const today = startOfDay(now);
	const currentWeekStart = addDays(today, -today.getDay());
	return addDays(currentWeekStart, -(visibleWeeks - 1) * 7);
}

function contributionYearsInRange(from: Date, to: Date): number[] {
	const years = [];
	for (let year = from.getFullYear(); year <= to.getFullYear(); year++) {
		years.push(year);
	}

	return years;
}

function formatTime(date: Date): string {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
}

function startOfDay(date: Date): Date {
	const value = new Date(date);
	value.setHours(0, 0, 0, 0);
	return value;
}

function addDays(date: Date, days: number): Date {
	const value = new Date(date);
	value.setDate(value.getDate() + days);
	return value;
}

Await.define({widget, widgetTimeline});
