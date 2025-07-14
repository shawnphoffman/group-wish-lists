'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { faLink } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { deleteItem } from '@/app/actions/items'
import { CancelIcon, DeleteIcon, EditIcon, MoveIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemCheckbox from '@/components/items/components/ItemCheckbox'
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ItemStatus, ListCategory, ListCategoryType } from '@/utils/enums'
import { getDomainFromUrl } from '@/utils/urls'

import AddCommentButton from '../comments/AddCommentButton'
import ItemComments from '../comments/ItemComments'

import MarkdownBlock from './components/MarkdownBlock'
import MyListsSelect from './components/MyListsSelect'

type Props = {
	item: ListItem
	listType: ListCategoryType
}

export default function ItemRowEditable({ item, listType }: Props) {
	const [isMoving, setIsMoving] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	// const handleDuplicateClick = useCallback(() => {
	// 	// TODO
	// 	console.log('DUPLICATE ITEM')
	// }, [])

	const handleDeleteClick = useCallback(async () => {
		if (window.confirm(`Are you sure you want to delete item "${item.title}"?`)) {
			setIsDeleting(true)
			const resp = await deleteItem(item.id)
			if (resp?.status === 'success') {
				startTransition(() => {
					setIsDeleting(() => false)
					router.refresh()
				})
			} else {
				setIsDeleting(false)
			}
		}
	}, [item, router])

	useEffect(() => {
		setIsEditing(false)
	}, [item])

	if (!item) return null

	if (item.archived) return null

	const pending = isPending || isDeleting

	// const LinkOrDiv = item.url ? Link : 'div'

	return (
		<div
			id={`item-${item.id}`}
			className={`${pending ? 'pending' : ''} ${isEditing ? 'editing' : ''} p-3 hover:bg-muted font-medium leading-normal gap-2 flex flex-col`}
		>
			<div className="flex flex-col w-full gap-2 divide-y divide-border ">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority */}
					{item.priority !== 'normal' && (
						<div className="flex flex-col items-center justify-center max-w-4 shrink-0">
							<ItemPriorityIcon priority={item.priority} />
						</div>
					)}
					{/* Checkbox */}
					{listType === ListCategory.Todos && (
						<ItemCheckbox id={item.id} isComplete={item.status === ItemStatus.Complete} canChange={true} status={item.status} />
					)}
					{/*  */}
					<div className="flex flex-col flex-1 w-full gap-2 overflow-hidden xs:items-center xs:flex-row md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
							<div className="flex flex-row items-center flex-1 gap-1 overflow-hidden font-medium">
								{/* Title */}
								{item.url ? (
									<Link
										href={item.url!}
										target="_blank"
										className={`flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 overflow-hidden hover:underline`}
									>
										{item.title}
										<div className="flex flex-row items-center gap-1">
											<FontAwesomeIcon
												icon={faLink}
												className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
												size="xs"
											/>
											<span className="flex text-xs text-muted-foreground">{getDomainFromUrl(item.url)}</span>
										</div>
									</Link>
								) : (
									<div>{item.title}</div>
								)}
								{item.price && (
									<Badge variant="outline" className="px-2 text-xs whitespace-nowrap bg-card w-fit">
										~{item.price}
									</Badge>
								)}
								{item.quantity && item.quantity > 1 && (
									<Badge variant="outline" className="px-2 text-xs whitespace-nowrap bg-card w-fit">
										Qty: {item.quantity}
									</Badge>
								)}
								{item.status === ItemStatus.Unavailable && (
									<Badge className="px-2 text-xs whitespace-nowrap bg-destructive text-destructive-foreground w-fit hover:bg-destructive/90">
										Unavailable
									</Badge>
								)}
							</div>
							{/* Notes */}
							{item.notes && (
								//
								<div className="inline-flex flex-col gap-0 text-sm text-foreground/75">
									<MarkdownBlock>{item.notes}</MarkdownBlock>
								</div>
							)}
						</div>
						{/* Image + Actions */}
						<div className="flex flex-row items-center justify-center gap-1 xs:flex-col sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="max-w-[80%] xs:max-w-full w-fit max-h-32 xs:w-24 xs:max-h-24" />

							<div className={twMerge('flex gap-2 ', item.image_url ? 'flex-col xs:flex-row sm:flex-col' : 'flex-row justify-end w-full')}>
								{/* Edit */}
								<AddCommentButton itemId={item.id} />
								{isEditing ? (
									<Button
										variant="ghost"
										size="icon"
										disabled={pending}
										type="button"
										onClick={handleEditClick}
										className={`text-base sm:text-xl group `}
									>
										{/* <span className="inline text-sm sm:hidden">Cancel</span> */}
										<CancelIcon />
									</Button>
								) : (
									<Button
										variant="ghost"
										size="icon"
										disabled={pending}
										type="button"
										onClick={handleEditClick}
										className={`text-base sm:text-xl group `}
									>
										{/* <span className="inline text-sm sm:hidden">Edit</span> */}
										<EditIcon />
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				{isEditing && (
					<>
						<div className="flex flex-row flex-wrap items-center justify-end gap-1 p-2 pt-2 pb-0">
							<Button variant="outline" type="button" size="sm" onClick={handleDeleteClick} className="group">
								Delete
								<DeleteIcon />
							</Button>
							<Button
								variant="outline"
								type="button"
								size="sm"
								onClick={() => {
									setIsMoving(!isMoving)
								}}
							>
								Move
								<MoveIcon />
							</Button>
							{item.url && (
								<Button variant="outline" type="button" size="sm" className="group" asChild>
									<Link href={item.url} target="_blank">
										Open URL
										<OpenUrlIcon />
									</Link>
								</Button>
							)}
							{/* {!isDeployed && (
									// TODO
									<button type="button" className="nav-btn orange" onClick={handleDuplicateClick}>
										<FontAwesomeIcon icon={faCopy} />
										Duplicate
									</button>
								)} */}
						</div>
						{isMoving && <MyListsSelect id={item.id} listId={item.list_id} />}
						<EditItemForm listId={item.list_id} item={item} />
					</>
				)}
			</div>

			{item?.item_comments && <ItemComments comments={item.item_comments} />}
		</div>
	)
}
