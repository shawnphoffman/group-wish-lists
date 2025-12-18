'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { faBan, faLink } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { deleteItem, updateItemStatus } from '@/app/actions/items'
import { CancelIcon, DeleteIcon, EditIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ItemStatus, ListCategory, ListCategoryType } from '@/utils/enums'
import { getDomainFromUrl } from '@/utils/urls'

import AddCommentButton from '../comments/AddCommentButton'
import ItemComments from '../comments/ItemComments'

import ItemCheckboxClient from './components/ItemCheckboxClient'
import MarkdownBlock from './components/MarkdownBlock'
import MoveItemButtonDialog from './components/MoveItemButtonDialog'
import { faCircle } from '@awesome.me/kit-f973af7de0/icons/sharp/regular'
import { formatPriceDisplay } from '@/utils/currency'

type Props = {
	item: ListItem
	listType: ListCategoryType
}

export default function ItemRowEditable({ item, listType }: Props) {
	const [isEditing, setIsEditing] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleMarkAsAvailable = () => {
		startTransition(async () => {
			await updateItemStatus(item.id, ItemStatus.Incomplete)
			router.refresh()
		})
	}

	const handleMarkAsUnavailable = () => {
		startTransition(async () => {
			await updateItemStatus(item.id, ItemStatus.Unavailable)
			router.refresh()
		})
	}

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
					{/* TODO FIX THIS */}
					{listType === ListCategory.Todos && (
						<ItemCheckboxClient
							id={item.id}
							status={item.status}
							requestedQty={item.quantity || 1}
							gifts={item.status === ItemStatus.Complete ? [{ quantity: 1 }] : []}
						/>
					)}
					{/*  */}
					<div className="flex flex-col flex-1 w-full gap-2 overflow-hidden xs:items-center xs:flex-row md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
							<div className="flex flex-row items-start flex-1 gap-1 overflow-hidden font-medium">
								{/* Title */}
								{item.url ? (
									<Link href={item.url!} target="_blank" className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}>
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
										{formatPriceDisplay(item.price)}
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
							{item.status === ItemStatus.Unavailable && (
								<Button variant="outline" type="button" size="sm" className="group" onClick={handleMarkAsAvailable}>
									Mark as Available
									<FontAwesomeIcon icon={faCircle} className={`text-green-600  group-hover:text-green-500 transition-colors`} />
								</Button>
							)}
							{item.status !== ItemStatus.Unavailable && item.status !== ItemStatus.Complete && (
								<Button variant="outline" type="button" size="sm" className="group" onClick={handleMarkAsUnavailable}>
									Mark as Unavailable
									<FontAwesomeIcon icon={faBan} className={`text-red-600  group-hover:text-red-500  transition-colors`} />
								</Button>
							)}

							<Button variant="outline" type="button" size="sm" onClick={handleDeleteClick} className="group">
								Delete
								<DeleteIcon />
							</Button>
							<MoveItemButtonDialog id={item.id} listId={item.list_id} />
							{item.url && (
								<Button variant="outline" type="button" size="sm" className="group" asChild>
									<Link href={item.url} target="_blank">
										Open URL
										<OpenUrlIcon />
									</Link>
								</Button>
							)}
						</div>
						<EditItemForm listId={item.list_id} item={item} />
					</>
				)}
			</div>

			{item?.item_comments && <ItemComments comments={item.item_comments} />}
		</div>
	)
}
