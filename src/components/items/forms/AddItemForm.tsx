'use client'

import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'
import ItemFormFields from '@/components/items/forms/ItemFormFields'
import { List } from '@/components/types'

type Props = {
	listId: List['id']
}

export default function AddItemForm({ listId }: Props) {
	const [state, formAction] = useFormState(createItem, {})

	return (
		<form action={formAction}>
			<ItemFormFields listId={listId} formState={state} />
		</form>
	)
}
