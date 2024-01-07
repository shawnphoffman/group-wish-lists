'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { archiveList } from '@/app/actions/lists'

export default function ArchiveListButton({ listId }: any) {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = await archiveList(listId)
		if (resp?.status === 'success') {
			console.log('archive success', { resp, listId })
			if (pathname === '/') {
				startTransition(() => {
					router.refresh()
				})
			}
		} else {
			console.log('archive error', { resp, listId })
		}
	}, [listId])

	return (
		<>
			<button className="hover:text-yellow-500 flex" title="Archive" onClick={handleClick} disabled={isPending}>
				<i className={`fa-sharp fa-solid fa-eye-slash text-lg`} aria-hidden="true" />
			</button>
		</>
	)
}
