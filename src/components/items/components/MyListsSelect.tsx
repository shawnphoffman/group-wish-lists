'use client'

import { startTransition, useCallback, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/navigation'

import { moveItem, moveItems } from '@/app/actions/items'
import { clearListsCache } from '@/app/actions/lists'
import { LoadingIcon, LockIcon, MoveIcon } from '@/components/icons/Icons'
import { List, ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import { useCachedLists } from '@/hooks/useCachedLists'

type Props = { listId: List['id']; id?: ListItem['id']; ids?: Set<ListItem['id']> }

export default function MyListsSelect({ id, listId, ids }: Props) {
	const { lists, loading } = useCachedLists()
	const [list, setList] = useState<List | null>(null)
	const router = useRouter()

	// Set the current list when lists are loaded
	useEffect(() => {
		if (lists.length > 0) {
			const currentList = lists.find((list: List) => list.id === Number(listId))
			setList(currentList || null)
		}
	}, [lists, listId])

	const handleMoveItem = useCallback(async () => {
		if (!list || (!id && !ids?.size)) return
		let resp: { status: string; items?: any } | null = null
		if (ids?.size) {
			resp = await moveItems(Array.from(ids), list?.id)
		} else {
			resp = await moveItem(id!, list?.id)
		}
		if (resp.status === 'success') {
			// Clear cache to ensure fresh data after moving items
			clearListsCache()
			startTransition(() => {
				router.refresh()
			})
		}
	}, [id, ids, list, router])

	if (loading) {
		return <LoadingIcon className="!border-0" />
	}

	if (!lists || !list) {
		return null
	}

	return (
		<fieldset className="flex flex-col items-center gap-2 pt-2 sm:flex-row !leading-none" disabled={loading || ids?.size === 0}>
			<RadioGroup value={list} onChange={setList} className="items-start flex flex-col gap-0.5 text-left flex-1 w-full">
				{lists.map(list => (
					<RadioGroup.Option value={list} key={list.id} className={'grid'}>
						{({ checked }) => (
							<Button variant={checked ? 'secondary' : 'ghost'} size="sm" className="">
								{list.id === Number(listId) ? <>{list.name} (Current)</> : list.name}
								{list?.private && <LockIcon />}
							</Button>
						)}
					</RadioGroup.Option>
				))}
			</RadioGroup>
			<Button variant={'outline'} disabled={listId === list.id} onClick={handleMoveItem}>
				Move
				<MoveIcon />
			</Button>
		</fieldset>
	)
}
