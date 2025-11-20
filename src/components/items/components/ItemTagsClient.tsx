'use client'

import MultipleSelector, { Option } from '@/components/ui/multi-select'

const OPTIONS: Option[] = [
	{ label: 'nextjs', value: 'Nextjs' },
	{ label: 'React', value: 'react' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Vite', value: 'vite' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Ember', value: 'ember', disable: true },
	{ label: 'Gatsby', value: 'gatsby', disable: true },
	{ label: 'Astro', value: 'astro' },
]

export default function ItemTagsClient() {
	// {/* https://shadcnui-expansions.typeart.cc/docs/multiple-selector */}
	return (
		<MultipleSelector
			value={OPTIONS.slice(0, 3)}
			defaultOptions={OPTIONS}
			hidePlaceholderWhenSelected
			placeholder="Select frameworks you like..."
			emptyIndicator={<p className="text-lg leading-10 text-center">no results found.</p>}
			inputProps={{
				className: 'p-0 border-none focus:ring-0',
			}}
			commandProps={
				{
					// className: 'py-1',
				}
			}
			className="flex items-center h-10 py-1.5 text-sm"
		/>
	)
}
