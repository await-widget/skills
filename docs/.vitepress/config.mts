import {defineConfig} from 'vitepress';

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
				items: [
					{text: 'Reference Overview', link: '/reference/'},
					{text: 'Components', link: '/reference/components'},
					{text: 'Props And Modifiers', link: '/reference/props-and-modifiers'},
					{text: 'Bridge APIs', link: '/reference/bridge-apis'},
					{text: 'Global Types', link: '/reference/global-types'},
					{text: 'JSX Runtime', link: '/reference/jsx-runtime'},
				],
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
