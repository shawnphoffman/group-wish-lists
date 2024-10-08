'use client'

import { startTransition, useCallback, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/navigation'

import { moveItem } from '@/app/actions/items'
import { getMyLists } from '@/app/actions/lists'
import { LoadingIcon, LockIcon, MoveIcon } from '@/components/icons/Icons'
import { List, ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'

type Props = {
	id: ListItem['id']
	listId: List['id']
}

export default function MyListsSelect({ id, listId }: Props) {
	const [lists, setLists] = useState<List[]>([])
	const [loading, setLoading] = useState(true)
	const [list, setList] = useState<List | null>(null)
	const router = useRouter()

	useEffect(() => {
		console.log('listId', listId)
		async function getListsAsync() {
			setLoading(true)
			// await new Promise(resolve => setTimeout(resolve, 500000))
			const { data: lists } = await getMyLists()
			setLists(lists)
			const currentList = lists.find((list: List) => list.id === listId)
			setList(currentList || null)
			setLoading(false)
		}
		getListsAsync()
	}, [listId])

	const handleMoveItem = useCallback(async () => {
		if (!list) return
		setLoading(true)
		const resp = await moveItem(id, list?.id)
		if (resp.status === 'success') {
			startTransition(() => {
				setLoading(false)
				router.refresh()
			})
		}
	}, [id, list, router])

	if (loading) {
		return <LoadingIcon className="!border-0" />
	}

	if (!lists || !list) {
		return null
	}

	return (
		<fieldset className="flex flex-col items-center gap-2 pt-2 sm:flex-row !leading-none" disabled={loading}>
			<RadioGroup value={list} onChange={setList} className="items-start flex flex-col gap-0.5 text-left flex-1 w-full">
				{lists.map(list => (
					<RadioGroup.Option value={list} key={list.id} className={'grid'}>
						{({ checked }) => (
							<Button variant={checked ? 'secondary' : 'outline'} size="sm" className="border">
								{list.name}
								{list?.private && <LockIcon />}
							</Button>
						)}
					</RadioGroup.Option>
				))}
			</RadioGroup>
			<Button variant={'outline'} disabled={listId === list.id} onClick={handleMoveItem}>
				Move Item
				<MoveIcon />
			</Button>
		</fieldset>
	)
}
