import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'
import { getEditableList } from '@/app/actions/lists'
import EmptyMessage from '@/components/common/EmptyMessage'
import { FallbackRowsMultiple, FallbackRowThick } from '@/components/common/Fallbacks'
import { AddIcon } from '@/components/icons/Icons'
import ImportAmazonButton from '@/components/imports/ImportAmazonButton'
import ImportAppleButton from '@/components/imports/ImportAppleButton'
import ImportButton from '@/components/imports/ImportButton'
import AddItemForm from '@/components/items/forms/AddItemForm'
import ItemRowEditable from '@/components/items/ItemRowEditable'
import ArchiveListButton from '@/components/lists/buttons/ArchiveListButton'
import ArchivePurchasedButton from '@/components/lists/buttons/ArchivePurchasedButton'
import DeleteListButton from '@/components/lists/buttons/DeleteListButton'
import ListTitleEditable from '@/components/lists/ListTitleEditable'
import EditorsButton from '@/components/permissions/EditorsButton'
import { List, ListItem } from '@/components/types'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Menubar, MenubarContent, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar'

type ClientProps = {
	params: {
		id: List['id']
	}
}

const ShowList = async ({ params }: ClientProps) => {
	const listPromise = getEditableList(params.id)
	const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: list, error }, currentUser] = await Promise.all([
		listPromise,
		sessionPromise,
		// fakePromise
	])

	if (error || !list) {
		return notFound()
	}

	// console.log('list', list)

	const items = list.listItems as unknown as ListItem[]
	// const editors = list.editors as unknown as ListEditorWrapper[]

	const visibleItems = items.filter(item => !item.archived)

	// console.log('ViewListClient', { items, visibleItems })

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-2 max-md:gap-2 animate-page-in">
			{/* Header */}
			<div className="flex flex-col items-center justify-between gap-2 md:gap-2 md:flex-row">
				<div className="flex flex-row items-center flex-1 w-full gap-2 flex-nowrap">
					<ListTitleEditable
						listId={params.id}
						name={list.name}
						type={list.type}
						description={list.description}
						private={list.private}
						shared={!!list.editors.length}
					/>
				</div>
				<div className="flex flex-row flex-wrap items-center justify-center flex-1 gap-1 md:justify-end shrink-0">
					<Link href="#add-item" className={`${buttonVariants({ variant: 'outline', size: 'sm' })} gap-1`}>
						<AddIcon />
						Add
					</Link>
					{/* <ImportButton listId={params.id} /> */}
					<Menubar className="p-0 h-9">
						<MenubarMenu>
							<MenubarTrigger>Import</MenubarTrigger>
							<MenubarContent>
								<ImportAppleButton listId={params.id} />
								<MenubarSeparator />
								<ImportAmazonButton listId={params.id} />
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
					{currentUser?.id === list.user_id && (
						<Menubar className="p-0 h-9">
							<MenubarMenu>
								<MenubarTrigger>List Actions</MenubarTrigger>
								<MenubarContent>
									<ArchiveListButton listId={params.id} isArchived={!list.active} />
									<MenubarSeparator />
									<ArchivePurchasedButton listId={params.id} />
									<MenubarSeparator />
									<DeleteListButton listId={params.id} name={list.name} />
									<MenubarSeparator />
									<EditorsButton listId={params.id} />
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					)}
				</div>
			</div>

			{/* Desc */}
			{list?.description && <div className="text-sm leading-tight text-muted-foreground">{list.description}</div>}

			{/* Rows */}
			<div className="flex flex-col">
				{visibleItems?.length === 0 ? (
					<EmptyMessage />
				) : (
					<div className="flex flex-col overflow-hidden border divide-y rounded-lg shadow-sm text-card-foreground bg-accent">
						{visibleItems?.map(item => <ItemRowEditable key={item.id} item={item} />)}
					</div>
				)}
			</div>
		</div>
	)
}

type Props = {
	params: Promise<{
		id: List['id']
	}>
}

export default async function EditList(props: Props) {
	const params = await props.params
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 px-2 max-md:gap-2">
			<Suspense fallback={<FallbackRowsMultiple />}>
				<ShowList params={params} />

				{/* Add Item */}
				<Card id="add-item" className="animate-page-in">
					<CardHeader>
						<CardTitle>Add Item</CardTitle>
						<CardDescription>Enter the information manually or import content from a URL below</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<FallbackRowThick />}>
							<AddItemForm listId={params.id} />
						</Suspense>
					</CardContent>
				</Card>
			</Suspense>
		</div>
	)
}
