import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getEditableList } from '@/app/actions/lists'

import RealTimeListener from '@/components/RealTimeListener'
import FallbackRow from '@/components/icons/Fallback'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import EditableListTitle from '@/components/lists/EditableListTitle'
import EmptyMessage from '@/components/lists/EmptyMessage'
import AddItem from '@/components/lists/create/AddItem'
import ImportItems from '@/components/lists/create/ImportItems'
import ListItemEditRow from '@/components/lists/create/ItemEditRow'
import { List, ListItem } from '@/components/lists/types'

import { isDeployed } from '@/utils/environment'

type Props = {
	params: {
		id: List['id']
	}
}

const ShowList = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getEditableList(params.id)

	const [{ data, error }] = await Promise.all([
		listPromise,
		// fakePromise
	])

	if (error || !data) {
		return notFound()
	}

	const items = data.listItems as unknown as ListItem[]
	return (
		<>
			{/* Header */}
			<div className="flex flex-col items-center justify-between gap-2 md:gap-6 md:flex-row">
				<div className="flex flex-row items-center gap-2">
					<EditableListTitle listId={params.id} name={data.name} type={data.type} />
				</div>
				<div className="flex flex-row gap-2">
					{!isDeployed && (
						<Link href="#import-items" className="nav-btn">
							<FontAwesomeIcon className="fa-sharp fa-file-import" />
							Import Items
						</Link>
					)}
					<Link href="#add-item" className="nav-btn">
						<FontAwesomeIcon className="fa-sharp fa-plus" />
						Add Item
					</Link>
				</div>
			</div>

			{/* Rows */}
			<div className="flex flex-col">
				{items?.length === 0 && <EmptyMessage />}
				<div className="flex flex-col list">{items?.map(item => <ListItemEditRow key={item.id} item={item} />)}</div>
			</div>
		</>
	)
}

export default async function EditList({ params }: Props) {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-3 opacity-0 animate-in">
			<Suspense fallback={<FallbackRow />}>
				<ShowList params={params} />
			</Suspense>

			{/* Add Item */}
			<AddItem listId={params.id} />

			{/* Import */}
			<ImportItems listId={params.id} />

			{/* Real-Time Boi
			<RealTimeListener listId={params.id} /> */}
		</div>
	)
}
