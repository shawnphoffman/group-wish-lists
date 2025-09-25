import { notFound } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { getEditableList } from '@/app/actions/lists'
import { List } from '@/components/types'

import SelectList from './SelectList'

type Props = {
	params: Promise<{
		id: string
	}>
}

export default async function EditSelectPage(props: Props) {
	const resolvedParams = await props.params
	const listId = Number(resolvedParams.id)
	const listPromise = getEditableList(listId)
	const sessionPromise = getSessionUser()

	const [{ data: list, error }, currentUser] = await Promise.all([listPromise, sessionPromise])

	if (error || !list) {
		return notFound()
	}

	// console.log('xxx', { items: list?.listItems, currentUser, resolvedParams })

	return <SelectList id={listId} items={list.listItems} list={list} />
}
