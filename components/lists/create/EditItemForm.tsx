'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { editItem } from '@/app/actions/items'

import { ListItemType } from '../types'
import ItemFormFields from './ItemFormFields'
import { Scrape } from './ScrapePreview'

type Props = {
	listId: string
	item?: ListItemType
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
