'use client'

import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useEffect, useState } from 'react'

import { moveItem } from '@/app/actions/items'
import { getMyLists } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { List, ListItem } from '@/components/types'

type Props = {
	id: ListItem['id']
	listId: List['id']
}

function MyListsSelectClient({ id, listId }: Props) {
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState<List | null>(null)
	const [lists, setLists] = useState<List[] | null>(null)
	const router = useRouter()

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
	}, [list])

	useEffect(() => {
		async function getLists() {
			const listPromise = getMyLists()
			const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

			const [{ data }]: [{ data: List[] | null }, any] = await Promise.all([listPromise, fakePromise])

			if (data) {
				const currentList = data.find(list => list.id === listId)
				startTransition(() => {
					setList(currentList || null)
					setLists(data)
				})
			}
		}
		if (!lists) {
			getLists()
		}
	}, [])

	if (!lists || !list) {
		return null
	}

	return (
		<fieldset className="flex flex-row items-center gap-2" disabled={loading}>
			<RadioGroup value={list} onChange={setList}>
				<div className="flex flex-col gap-1">
					{lists.map(list => (
						<RadioGroup.Option value={list} key={list.id}>
							{({ checked }) => <label className={`nav-btn text-sm flex-1 py-1 w-full ${checked ? 'purple' : 'gray'}`}>{list.name}</label>}
						</RadioGroup.Option>
					))}
				</div>
			</RadioGroup>
			<button type="button" disabled={listId === list.id} onClick={handleMoveItem} className="btn purple">
				<FontAwesomeIcon className="fa-sharp fa-solid fa-right-long-to-line" />
				Move Item
			</button>
		</fieldset>
	)
}

export default async function MyListsSelect(props: Props) {
	return <MyListsSelectClient {...props} />
}
