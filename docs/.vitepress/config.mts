import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitepress';

const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referenceDir = path.join(docsDir, 'reference');
const referenceItems = [
	{text: 'Reference Overview', link: '/reference/'},
	...generatedReferenceItems(),
];

function generatedReferenceItems() {
	const items = referenceItemsFromIndex();
	if (items.length > 0) {
		return items;
	}

	return readdirSync(referenceDir)
		.filter(file => file.endsWith('.md') && file !== 'index.md' && file !== 'README.md')
		.sort((a, b) => a.localeCompare(b))
		.map(referenceItem);
}

function referenceItemsFromIndex() {
	const source = readFileSync(path.join(referenceDir, 'index.md'), 'utf8');
	return [...source.matchAll(/^- \[([^\]]+)\]\(([^)]+\.md)\)$/gmu)]
		.map(match => ({
			text: match[1],
			link: `/reference/${match[2].replace(/\.md$/u, '')}`,
		}));
}

function referenceItem(file: string) {
	return {
		text: titleFromReferenceFile(file),
		link: `/reference/${file.replace(/\.md$/u, '')}`,
	};
}

function titleFromReferenceFile(file: string) {
	return file
		.replace(/\.md$/u, '')
		.split('-')
		.map(part => `${part[0].toUpperCase()}${part.slice(1)}`)
		.join(' ');
}

export default defineConfig({
	title: 'Await Widget',
	description: 'AI-first developer documentation for Await widgets.',
	cleanUrls: true,
	lastUpdated: true,
	themeConfig: {
		logo: undefined,
		search: {
			provider: 'local',
		},
		nav: [
			{text: 'Guides', link: '/guides/runtime-model'},
			{text: 'Reference', link: '/reference/'},
			{text: 'Prompts', link: '/prompts/cookbook'},
		],
		sidebar: [
			{
				text: 'Start',
				items: [
					{text: 'Overview', link: '/'},
				],
			},
			{
				text: 'Guides',
				items: [
					{text: 'Runtime Model', link: '/guides/runtime-model'},
					{text: 'Create A Widget', link: '/guides/create-a-widget'},
					{text: 'Modify A Widget', link: '/guides/modify-a-widget'},
					{text: 'Panels', link: '/guides/panels'},
					{text: 'Timeline', link: '/guides/timeline'},
					{text: 'Intents', link: '/guides/intents'},
					{text: 'Bridge APIs', link: '/guides/bridge-apis'},
				],
			},
			{
				text: 'Reference',
				items: referenceItems,
			},
			{
				text: 'Prompts',
				items: [
					{text: 'Prompt Cookbook', link: '/prompts/cookbook'},
				],
			},
		],
		socialLinks: [
			{icon: 'github', link: 'https://github.com/await-widget/skills'},
		],
	},
});
