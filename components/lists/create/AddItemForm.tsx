'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'

import ItemFormFields from './ItemFormFields'
import { Scrape } from './ScrapePreview'

type Props = {
	listId: string
	scrape?: Scrape
	clearScrape?: () => void
}

export default function AddItemForm({ listId, scrape, clearScrape }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(createItem, {})

	return (
		<ItemFormFields formRef={formRef} listId={listId} scrape={scrape} clearScrape={clearScrape} formAction={formAction} formState={state} />
	)
}
