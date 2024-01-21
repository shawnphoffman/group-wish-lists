'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { archiveList, unarchiveList } from '@/app/actions/lists'

import { ArchiveIcon, UnarchiveIcon } from '@/components/icons/Icons'
import { List } from '@/components/types'

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
	}, [isArchived, listId, router])

	return isArchived ? (
		<button className="nav-btn teal" title="Restore List" onClick={handleClick} disabled={isPending}>
			<UnarchiveIcon includeColor={false} />
			Restore
		</button>
	) : (
		<button className="yellow nav-btn" title="Archive List" onClick={handleClick} disabled={isPending}>
			<ArchiveIcon includeColor={false} />
			Archive
		</button>
	)
}
