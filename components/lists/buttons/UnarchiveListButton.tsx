'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { unarchiveList } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { UnarchiveIcon } from '@/components/icons/Icons'

export default function UnarchiveListButton({ listId }: any) {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = await unarchiveList(listId)
		if (resp?.status === 'success') {
			console.log('unarchive success', { resp, listId })
			if (pathname === '/') {
				startTransition(() => {
					router.refresh()
				})
			}
		} else {
			console.log('unarchive error', { resp, listId })
		}
	}, [listId])

	return (
		<>
			<button className="flex text-lg " title="Restore" onClick={handleClick} disabled={isPending}>
				<UnarchiveIcon />
			</button>
		</>
	)
}
