import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppRouterContext, type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import ItemComment from './ItemComment'

const meta = {
	decorators: [
		Story => (
			<AppRouterContext.Provider value={{} as AppRouterInstance}>
				<Story />
			</AppRouterContext.Provider>
		),
	],
	component: ItemComment,
} satisfies Meta<typeof ItemComment>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		comment: {
			id: 1,
			comments: 'This is a comment',
			isOwner: false,
			user: {
				user_id: '1',
				display_name: 'John Doe',
			},
			item_id: '',
			created_at: new Date(),
			archived: false,
		},
	},
}
