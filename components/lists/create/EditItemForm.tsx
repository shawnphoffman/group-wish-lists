'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { editItem } from '@/app/actions/items'

import { List, ListItem } from '../types'
import ItemFormFields from './ItemFormFields'

type Props = {
	listId: List['id']
	item?: ListItem
}

export default function EditItemForm({ listId, item }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(editItem, {})

	return (
		<div className="flex flex-col items-stretch gap-2 p-2">
			<h5>Item Details</h5>
			<form action={formAction} ref={formRef}>
				<ItemFormFields listId={listId} formState={state} item={item} />
			</form>
		</div>
	)
}
