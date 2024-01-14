'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'

import { List, Scrape } from '../types'
import ItemFormFields from './ItemFormFields'

type Props = {
	listId: List['id']
	scrape?: Scrape
	clearScrape?: () => void
}

export default function AddItemForm({ listId, scrape, clearScrape }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(createItem, {})

	return (
		<div className="flex flex-col items-stretch gap-2 p-2">
			<h5>Item Details</h5>
			<form action={formAction} ref={formRef}>
				<ItemFormFields
					listId={listId}
					scrape={scrape}
					//
					clearScrape={clearScrape}
					formState={state}
				/>
			</form>
		</div>
	)
}
