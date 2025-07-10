import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ItemPriority, ItemStatus } from '@/utils/enums'

import PurchaseRow from './PurchaseRow'

const meta = {
	component: PurchaseRow,
} satisfies Meta<typeof PurchaseRow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		item: {
			id: '1',
			list_id: 1,
			title: 'Test Item',
			status: ItemStatus.Incomplete,
			priority: ItemPriority.Low,
			archived: false,
			created_at: new Date(),
		},
	},
}
