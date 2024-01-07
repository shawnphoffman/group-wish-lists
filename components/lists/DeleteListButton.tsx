'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { deleteList } from '@/app/actions/lists'

export default function DeleteListButton({ listId, name }: any) {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete list "${name}"?`)) {
			const resp = await deleteList(listId)
			if (resp?.status === 'success') {
				console.log('delete success', { resp, listId, name })
				if (pathname === '/') {
					startTransition(() => {
						router.refresh()
					})
				}
			} else {
				console.log('delete error', { resp, listId, name })
			}
		}
	}, [listId, name])

	return (
		<>
			<button className="hover:text-red-500 flex" title="Delete" onClick={handleClick} disabled={isPending}>
				<i className={`fa-sharp fa-solid fa-trash-xmark text-lg`} aria-hidden="true" />
			</button>
		</>
	)
}
