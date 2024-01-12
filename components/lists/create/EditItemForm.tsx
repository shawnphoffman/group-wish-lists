'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { editItem } from '@/app/actions/items'

import { ListItem, Scrape } from '../types'
import ItemFormFields from './ItemFormFields'

type Props = {
	listId: string
	item?: ListItem
}

export default function EditItemForm({ listId, item }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(editItem, {})

	return (
		<ItemFormFields
			formRef={formRef}
			listId={listId}
			scrape={item?.scrape as Scrape}
			clearScrape={() => {
				delete item?.scrape
			}}
			formAction={formAction}
			formState={state}
			item={item}
		/>
	)
}
