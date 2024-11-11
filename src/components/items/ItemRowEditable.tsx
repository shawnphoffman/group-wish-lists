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
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import AddCommentButton from '../comments/AddCommentButton'
import ItemComments from '../comments/ItemComments'

import MyListsSelect from './components/MyListsSelect'

type Props = {
	item: ListItem
}

export default function ItemRowEditable({ item }: Props) {
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
					{/*  */}
					<div className="flex flex-col flex-1 w-full gap-2 overflow-hidden xs:items-center xs:flex-row md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-1 overflow-hidden">
							<div className="flex flex-row items-center flex-1 gap-1 overflow-hidden">
								{/* Title */}
								{item.url ? (
									<Link href={item.url!} target="_blank" className={`flex items-center gap-1 overflow-hidden hover:underline`}>
										<span>
											{item.title}
											<FontAwesomeIcon
												icon={faLink}
												className="ml-1 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
												size="xs"
											/>
										</span>
									</Link>
								) : (
									<div>{item.title}</div>
								)}
								{item.price && (
									<Badge variant="outline" className="whitespace-nowrap bg-card h-5 w-fit px-1.5 ml-2 text-[10px]">
										~{item.price}
									</Badge>
								)}
							</div>
							{/* Notes */}
							{item.notes && <div className="text-sm break-words whitespace-pre-line text-muted-foreground">{item.notes}</div>}
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
							<Button variant="outline" type="button" size="sm" onClick={handleDeleteClick}>
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
								<Button variant="outline" type="button" size="sm" asChild>
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
