import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { getEditableList, getMyLists } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import FallbackRow from '@/components/common/Fallbacks'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ImportItems from '@/components/imports/ImportItems'
import AddItemForm from '@/components/items/forms/AddItemForm'
import ItemRowEditable from '@/components/items/ItemRowEditable'
import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import ListTitleEditable from '@/components/lists/ListTitleEditable'
import Permissions from '@/components/permissions/Permissions'
import { List, ListItem } from '@/components/types'

type Props = {
	params: {
		id: List['id']
	}
}

const ShowList = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getEditableList(params.id)
	const listsPromise = getMyLists()

	const [{ data, error }, { data: lists }, currentUser] = await Promise.all([
		listPromise,
		listsPromise,
		getSessionUser(),
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]
	return (
		<>
			{/* Header */}
			<div className="flex flex-col items-center justify-between gap-2 md:gap-2 md:flex-row">
				<div className="flex flex-row items-center flex-initial gap-2 w-fit flex-nowrap">
					<ListTitleEditable listId={params.id} name={data.name} type={data.type} />
				</div>
				<div className="flex flex-row flex-wrap justify-center flex-1 gap-1 md:justify-end shrink-0">
					{currentUser?.id === data.user_id && (
						<>
							<ArchiveListButton listId={params.id} isArchived={!data.active} />
							<DeleteListButton listId={params.id} name={data.name} />
						</>
					)}
					<Link href="#import-items" className="nav-btn purple">
						<FontAwesomeIcon className="fa-sharp fa-file-import" />
						Import Items
					</Link>
					<Link href="#add-item" className="nav-btn blue">
						<FontAwesomeIcon className="fa-sharp fa-plus" />
						Add Item
					</Link>
				</div>
			</div>

			{/* Rows */}
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col list">
					{items?.map(item => <ItemRowEditable key={item.id} item={item} lists={lists as List[]} />)}
				</div>
			</div>
		</>
	)
}

export default async function EditList({ params }: Props) {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-3 opacity-0 max-md:gap-2 animate-in">
			<Suspense fallback={<FallbackRow />}>
				<ShowList params={params} />
			</Suspense>

			{/* Add Item */}
			<div className="border-container" id="add-item">
				<h4>Add Item</h4>
				<Suspense fallback={<FallbackRow />}>
					<div className="flex flex-col items-stretch gap-2 p-2">
						<AddItemForm listId={params.id} />
					</div>
				</Suspense>
			</div>

			{/* Import */}
			<ImportItems listId={params.id} />

			{/* Permissions */}
			{process.env.VERCEL_ENV !== 'production' && <Permissions listId={params.id} />}
		</div>
	)
}
