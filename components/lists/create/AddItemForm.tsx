'use client'

import { useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createItem } from '@/app/actions/items'

import { List } from '../types'
import ItemFormFields from './ItemFormFields'

type Props = {
	listId: List['id']
}

export default function AddItemForm({ listId }: Props) {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction] = useFormState(createItem, {})

	return (
		<form action={formAction} ref={formRef}>
			<ItemFormFields listId={listId} formState={state} />
		</form>
	)
}
