'use client'

import { RadioGroup } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState, useTransition } from 'react'

import { deleteItem } from '@/app/actions/items'

import { DeleteIcon, EditIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { List, ListItem } from '@/components/types'

import { ItemPriority } from '@/utils/enums'
import { isDeployed } from '@/utils/environment'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import MyListsSelect from './components/MyListsSelect'

type Props = {
	item: ListItem
	lists: List[]
}

export default function ItemRowEditable({ item, lists }: Props) {
	const [isMoving, setIsMoving] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleEditClick = useCallback(() => {
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleDuplicateClick = useCallback(() => {
		// TODO
		console.log('DUPLICATE ITEM')
	}, [])

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
				console.log('delete error', { resp, item })
			}
		}
	}, [isEditing])

	useEffect(() => {
		if (isEditing) {
			setIsEditing(false)
		}
	}, [item])

	if (!item) return null

	const pending = isPending || isDeleting

	return (
		<div className={`list-item ${pending && 'pending'} ${isEditing && 'editing'}`}>
			<div className="flex flex-col w-full gap-2 divide-y-2 divide-gray-300 dark:divide-gray-700 divide-dashed">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority */}
					{item.priority !== ItemPriority.Normal && (
						<div className="flex flex-col items-center justify-center max-w-4 shrink-0">
							<ItemPriorityIcon priority={item.priority} />
						</div>
					)}
					{/*  */}
					<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col flex-1">
							{/* Title */}
							<div>{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="notes">{item.notes}</div>}
						</div>
						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="w-16 max-h-16 xs:w-24 xs:max-h-24" />
							{/* Edit */}
							{isEditing ? (
								<button disabled={pending} type="button" onClick={handleEditClick} className={`nav-btn text-base sm:text-xl orange`}>
									<FontAwesomeIcon className="fa-sharp fa-solid fa-ban" />
									<span className="inline text-sm sm:hidden">Cancel</span>
								</button>
							) : (
								<button disabled={pending} type="button" onClick={handleEditClick} className={`nav-btn text-base sm:text-xl yellow`}>
									<EditIcon includeColor={false} />
									<span className="inline text-sm sm:hidden">Edit</span>
								</button>
							)}
						</div>
					</div>
				</div>

				{isEditing && (
					<>
						<div className="flex flex-col items-center gap-2 p-2 pb-0 justify-stretch md:flex-row">
							<h5 className="md:mr-8 max-md:self-start">Actions</h5>
							<div className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-4">
								<button type="button" className="nav-btn red" onClick={handleDeleteClick}>
									<DeleteIcon includeColor={false} />
									Delete
								</button>
								{!isDeployed && (
									<div className="flex flex-row gap-2">
										<button
											type="button"
											className={`nav-btn purple ${isMoving && 'bg-violet-800/30 text-violet-300'}`}
											onClick={() => setIsMoving(!isMoving)}
										>
											<FontAwesomeIcon className="fa-sharp fa-solid fa-right-long-to-line" />
											Move
										</button>
									</div>
								)}
								{item.url && (
									<Link href={item.url} target="_blank" className="nav-btn teal">
										<OpenUrlIcon includeColor={false} />
										Open URL
									</Link>
								)}
								{!isDeployed && (
									// TODO
									<button type="button" className="nav-btn orange" onClick={handleDuplicateClick}>
										<FontAwesomeIcon className="fa-sharp fa-solid fa-copy" />
										Duplicate
									</button>
								)}
							</div>
						</div>
						{isMoving && <MyListsSelect lists={lists} id={item.id} listId={item.list_id} />}
						<EditItemForm listId={item.list_id} item={item} />
					</>
				)}
			</div>
		</div>
	)
}
