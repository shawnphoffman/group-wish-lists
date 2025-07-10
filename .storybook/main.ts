import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-onboarding',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/nextjs-vite',
		options: {},
	},
	staticDirs: [
		{
			from: '../node_modules/geist/dist/fonts/geist-sans',
			to: '/fonts/geist-sans',
		},
		{
			from: '../node_modules/geist/dist/fonts/geist-mono',
			to: '/fonts/geist-mono',
		},
	],
}
export default config
