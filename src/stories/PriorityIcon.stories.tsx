import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import { ItemPriority } from '@/utils/enums'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/Icons/PriorityIcon',
	component: ItemPriorityIcon,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		priority: {
			control: 'select',
			options: [ItemPriority['Very High'], ItemPriority.High, ItemPriority.Normal, ItemPriority.Low],
			description: 'The priority level of the item',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the icon',
		},
	},
} satisfies Meta<typeof ItemPriorityIcon>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const VeryHigh: Story = {
	args: {
		priority: ItemPriority['Very High'],
	},
}

export const High: Story = {
	args: {
		priority: ItemPriority.High,
	},
}

export const Low: Story = {
	args: {
		priority: ItemPriority.Low,
	},
}

export const Normal: Story = {
	args: {
		priority: ItemPriority.Normal,
	},
	parameters: {
		docs: {
			description: {
				story: 'Normal priority returns null and renders nothing.',
			},
		},
	},
}

export const WithCustomClassName: Story = {
	args: {
		priority: ItemPriority.High,
		className: 'text-2xl',
	},
}

export const AllPriorities: Story = {
	args: {
		priority: ItemPriority.High,
		className: 'text-2xl',
	},
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<div className="flex items-center gap-2">
				<span className="w-24">Very High:</span>
				<ItemPriorityIcon priority={ItemPriority['Very High']} />
			</div>
			<div className="flex items-center gap-2">
				<span className="w-24">High:</span>
				<ItemPriorityIcon priority={ItemPriority.High} />
			</div>
			<div className="flex items-center gap-2">
				<span className="w-24">Normal:</span>
				<ItemPriorityIcon priority={ItemPriority.Normal} />
				<span className="text-sm text-muted-foreground">(no icon)</span>
			</div>
			<div className="flex items-center gap-2">
				<span className="w-24">Low:</span>
				<ItemPriorityIcon priority={ItemPriority.Low} />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'A comparison of all priority levels side by side.',
			},
		},
	},
}
