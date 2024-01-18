'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { deleteList } from '@/app/actions/lists'

import { DeleteIcon } from '@/components/icons/Icons'

export default function DeleteListButton({ listId, name }: any) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete list "${name}"?`)) {
			const resp = await deleteList(listId)
			if (resp?.status === 'success') {
				console.log('delete success', { resp, listId, name })
				startTransition(() => {
					router.refresh()
				})
			} else {
				console.log('delete error', { resp, listId, name })
			}
		}
	}, [listId, name])

	return (
		<button className="nav-btn red" title="Delete List" onClick={handleClick} disabled={isPending}>
			<DeleteIcon includeColor={false} />
			Delete
		</button>
	)
}
