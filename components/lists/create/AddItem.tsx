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
		<div className="border-container" id="add-item">
			<h4>Add Item</h4>
			<ScrapeUrl setScrape={setScrape} scrape={scrape} />
			<AddItemForm listId={listId} scrape={scrape} clearScrape={clearScrape} />
		</div>
	)
}
