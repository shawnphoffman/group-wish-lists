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
		<div className="flex flex-col gap-2 items-stretch border border-dashed border-red-400 p-4">
			<h3>Add Item</h3>

			<ScrapeUrl setScrape={setScrape} scrape={scrape} />

			{scrape && <Code code={JSON.stringify(scrape, null, 2)} />}

			<AddItemForm listId={listId} scrape={scrape} clearScrape={clearScrape} />
		</div>
	)
}
