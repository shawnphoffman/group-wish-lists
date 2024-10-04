'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { deleteList } from '@/app/actions/lists'
import { DeleteIcon } from '@/components/icons/Icons'
import { buttonVariants } from '@/components/ui/button'

export default function DeleteListButton({ listId, name }: any) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete list "${name}"?`)) {
			const resp = await deleteList(listId)
			if (resp?.status === 'success') {
				startTransition(() => {
					router.push('/me')
					router.refresh()
				})
			}
		}
	}, [listId, name, router])

	return (
		<button
			className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-1`}
			title="Delete List"
			onClick={handleClick}
			disabled={isPending}
		>
			<DeleteIcon />
			Delete
		</button>
	)
}
