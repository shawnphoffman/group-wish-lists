'use client'

import { memo } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { editItem } from '@/app/actions/items'

import ItemFormFields from '@/components/items/forms/ItemFormFields'
import { List, ListItem } from '@/components/types'

type Props = {
	listId: List['id']
	item?: ListItem
}

function EditItemForm({ listId, item }: Props) {
	const [state, formAction] = useFormState(editItem, {})

	console.log('EditItemForm')

	return (
		<div className="flex flex-col items-stretch gap-2 p-2">
			<h5>Item Details</h5>

			<form action={formAction}>
				<ItemFormFields listId={listId} formState={state} item={item} />
			</form>
		</div>
	)
}

export default memo(EditItemForm)
