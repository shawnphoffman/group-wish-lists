'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'

// import { useSearchParams } from 'next/navigation'
import { createItem } from '@/app/actions/items'
import ItemFormFields from '@/components/items/forms/ItemFormFields'
import { List } from '@/components/types'

type Props = {
	listId: List['id']
}

export default function AddItemForm({ listId }: Props) {
	const [state, formAction] = useActionState(createItem, {})
	// const searchParams = useSearchParams()

	useEffect(() => {
		const scrollToHash = () => {
			const hash = window.location.hash
			if (hash) {
				setTimeout(() => {
					const elementId = hash.startsWith('#') ? hash.substring(1) : hash
					const element = document.getElementById(elementId)
					// console.log('scrolling to hash', { hash, element })
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}
				}, 500)
			}
		}

		// Call `scrollToHash` on initial render and whenever `pathname` or `searchParams` change
		scrollToHash()
		// }, [searchParams])
	}, [])

	return (
		<form action={formAction}>
			<ItemFormFields listId={listId} formState={state} />
		</form>
	)
}
