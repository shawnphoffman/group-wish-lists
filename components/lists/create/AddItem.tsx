'use client'

import { useCallback, useState } from 'react'

import { List, Scrape } from '../types'
import AddItemForm from './AddItemForm'
import ScrapeUrl from './ScrapeUrl'

type Props = {
	listId: List['id']
}

export default function AddItem({ listId }: Props) {
	const [scrape, setScrape] = useState<Scrape | undefined>()

	const clearScrape = useCallback(() => {
		setScrape(undefined)
	}, [])

	return (
		<div className="flex flex-col items-stretch gap-x-3.5 gap-y-4 p-4 text-base font-medium bg-white border border-gray-200 text-gray-800 -mt-px rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white divide-y divide-gray-700">
			<h4>Add Item</h4>
			<ScrapeUrl setScrape={setScrape} scrape={scrape} />
			<AddItemForm listId={listId} scrape={scrape} clearScrape={clearScrape} />
		</div>
	)
}
