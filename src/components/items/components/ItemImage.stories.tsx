import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import ItemImage from './ItemImage'

const meta = {
	component: ItemImage,
} satisfies Meta<typeof ItemImage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		url: 'https://shawn.party/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhead.b46e8b52.png&w=64&q=75',
	},
}
