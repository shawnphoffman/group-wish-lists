import * as React from 'react'
import type { Preview } from '@storybook/nextjs-vite'

import '@/app/globals.css'

import { withThemeByClassName } from '@storybook/addon-themes'

import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks'

const preview: Preview = {
	parameters: {
		docs: {
			page: () => (
				<>
					<style>{`
						.docs-story {
							background-color: hsl(var(--background)) !important;
						}
					`}</style>
					<div className="dark ">
						<Title />
						<Subtitle />
						<Description />
						<Primary />
						<Controls />
						<Stories />
					</div>
				</>
			),
		},

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
	},

	decorators: [
		withThemeByClassName({
			themes: {
				// nameOfTheme: 'classNameForTheme',
				light: '',
				dark: 'dark',
			},
			defaultTheme: 'dark',
		}),
	],
}

export default preview
