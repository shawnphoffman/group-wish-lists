'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'

import { createItem } from '@/app/actions/items'
import ItemFormFields from '@/components/items/forms/ItemFormFields'
import { List, ListItem } from '@/components/types'

type Props = {
	listId: List['id']
	item: ListItem
}

export default function CloneItemFormFields({ listId, item }: Props) {
	const [state, formAction] = useActionState(createItem, {})

	useEffect(() => {
		const scrollToHash = () => {
			const hash = window.location.hash
			if (hash) {
				setTimeout(() => {
					const elementId = hash.startsWith('#') ? hash.substring(1) : hash
					const element = document.getElementById(elementId)
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}
				}, 500)
			}
		}

		scrollToHash()
	}, [])

	return (
		<form action={formAction}>
			<ItemFormFields listId={listId} formState={state} item={item} />
		</form>
	)
}
