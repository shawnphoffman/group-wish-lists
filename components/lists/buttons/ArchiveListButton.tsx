'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { archiveList } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

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
			<button className="flex hover:text-yellow-500" title="Archive" onClick={handleClick} disabled={isPending}>
				<FontAwesomeIcon className="text-lg fa-sharp fa-solid fa-eye-slash" />
			</button>
		</>
	)
}
