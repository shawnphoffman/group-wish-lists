'use client'

import { useCallback, useState } from 'react'

import Code from '@/components/Code'

import AddItemForm from './AddItemForm'
import { Scrape } from './ScrapePreview'
import ScrapeUrl from './ScrapeUrl'

export default function AddItem({ listId }: { listId: string }) {
	// const [isLoading, setIsLoading] = useState(false)
	const [scrape, setScrape] = useState<Scrape | undefined>()

	const clearScrape = useCallback(() => {
		setScrape(undefined)
	}, [])

	return (
		// <div className="flex flex-col gap-2 items-stretch border border-dashed border-red-400 p-4">
		// <div className="flex flex-col gap-2 items-stretch divide-y-2 p-4 border">
		<div className="flex flex-col items-stretch gap-x-3.5 gap-y-4 p-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white divide-y divide-gray-700">
			<h4>Add Item</h4>

			<ScrapeUrl setScrape={setScrape} scrape={scrape} />

			{scrape && <Code code={JSON.stringify(scrape, null, 2)} />}

			<AddItemForm listId={listId} scrape={scrape} clearScrape={clearScrape} />
		</div>
	)
}
