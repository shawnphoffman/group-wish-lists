import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { getEditableList, getMyLists } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import FallbackRow from '@/components/common/Fallbacks'
import { AddIcon } from '@/components/icons/Icons'
import ImportButton from '@/components/imports/ImportButton'
import AddItemForm from '@/components/items/forms/AddItemForm'
import ItemRowEditable from '@/components/items/ItemRowEditable'
import ArchivePurchasedButton from '@/components/lists/ArchivePurchasedButton'
import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import ListTitleEditable from '@/components/lists/ListTitleEditable'
import PermissionsButton from '@/components/permissions/PermissionsButton'
import { List, ListItem } from '@/components/types'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Menubar, MenubarContent, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar'

type Props = {
	params: {
		id: List['id']
	}
}

const ShowList = async ({ params }: Props) => {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const listPromise = getEditableList(params.id)
	// const listsPromise = getMyLists()

	// const [{ data, error }, { data: lists }, currentUser] = await Promise.all([
	const [{ data, error }, currentUser] = await Promise.all([
		listPromise,
		// listsPromise,
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
				<div className="flex flex-row items-center flex-1 w-full gap-2 flex-nowrap">
					<ListTitleEditable listId={params.id} name={data.name} type={data.type} />
				</div>
				<div className="flex flex-row flex-wrap justify-center flex-1 gap-0.5 items-center md:justify-end shrink-0">
					<Link href="#add-item" className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-1`}>
						<AddIcon />
						Add
					</Link>
					<ImportButton listId={params.id} />
					{currentUser?.id === data.user_id && (
						<Menubar>
							<MenubarMenu>
								<MenubarTrigger>List Actions</MenubarTrigger>
								<MenubarContent>
									<ArchiveListButton listId={params.id} isArchived={!data.active} />
									<MenubarSeparator />
									<DeleteListButton listId={params.id} name={data.name} />
									<MenubarSeparator />
									{process.env.VERCEL_ENV !== 'production' && <ArchivePurchasedButton listId={params.id} />}
									<MenubarSeparator />
									{process.env.VERCEL_ENV !== 'production' && <PermissionsButton listId={params.id} />}
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					)}
				</div>
			</div>

			{/* Rows */}
			<div className="flex flex-col">
				{items?.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{items?.map(item => <ItemRowEditable key={item.id} item={item} />)}
					</div>
				)}
			</div>
		</>
	)
}

export default async function EditList({ params }: Props) {
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-2 max-md:gap-2">
			<Suspense fallback={<FallbackRow />}>
				<ShowList params={params} />
			</Suspense>

			{/* Add Item */}
			<Card id="add-item">
				<CardHeader>
					<CardTitle>Add Item</CardTitle>
					<CardDescription>Enter the information manually or import content from a URL below</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<FallbackRow />}>
						<AddItemForm listId={params.id} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
