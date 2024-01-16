'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { archiveList, unarchiveList } from '@/app/actions/lists'

import { ArchiveIcon, UnarchiveIcon } from '@/components/icons/Icons'

import { List } from '../types'

type Props = {
	listId: List['id']
	isArchived: boolean
}

export default function ArchiveListButton({ listId, isArchived }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		const resp = isArchived ? await unarchiveList(listId) : await archiveList(listId)
		if (resp?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [listId, isArchived])

	return isArchived ? (
		<button className="flex text-lg " title="Restore" onClick={handleClick} disabled={isPending}>
			<UnarchiveIcon />
		</button>
	) : (
		<button className="flex text-lg" title="Archive" onClick={handleClick} disabled={isPending}>
			<ArchiveIcon />
		</button>
	)
}
