'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { faRightLongToLine } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { deleteItem } from '@/app/actions/items'
import { CancelIcon, DeleteIcon, EditIcon, MoveIcon, OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import EditItemForm from '@/components/items/forms/EditItemForm'
import { ListItem } from '@/components/types'
import { Button } from '@/components/ui/button'
import { ItemPriority } from '@/utils/enums'

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

	const pending = isPending || isDeleting

	return (
		<div className={`${pending ? 'pending' : ''} ${isEditing ? 'editing' : ''} p-3 hover:bg-muted font-medium leading-normal`}>
			<div className="flex flex-col w-full gap-2 divide-y divide-border ">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority */}
					<div className="flex flex-col items-center justify-center max-w-4 shrink-0">
						<ItemPriorityIcon priority={item.priority} />
					</div>
					{/*  */}
					<div className="flex flex-row items-center flex-1 w-full gap-2 md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col flex-1 overflow-hidden">
							{/* Title */}
							<div>{item.title}</div>
							{/* Notes */}
							{item.notes && <div className="text-sm break-words whitespace-pre-line text-muted-foreground">{item.notes}</div>}
						</div>
						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-1 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="w-16 max-h-16 xs:w-24 xs:max-h-24" />
							{/* Edit */}
							{isEditing ? (
								<Button
									variant="outline"
									size="sm"
									disabled={pending}
									type="button"
									onClick={handleEditClick}
									className={`text-base sm:text-xl group`}
								>
									<span className="inline text-sm sm:hidden">Cancel</span>
									<CancelIcon />
								</Button>
							) : (
								<Button
									variant="outline"
									size="sm"
									disabled={pending}
									type="button"
									onClick={handleEditClick}
									className={`text-base sm:text-xl group`}
								>
									<span className="inline text-sm sm:hidden">Edit</span>
									<EditIcon />
								</Button>
							)}
						</div>
					</div>
				</div>

				{isEditing && (
					<>
						<div className="flex flex-row flex-wrap items-center justify-end gap-1 p-2 pt-2 pb-0">
							{/* <h4 className="md:mr-8 max-md:self-start">Actions</h4> */}
							<Button variant="outline" type="button" size="sm" onClick={handleDeleteClick}>
								Delete
								<DeleteIcon />
							</Button>
							<Button
								variant="outline"
								type="button"
								size="sm"
								onClick={() => {
									console.log('Move', isMoving)
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
		</div>
	)
}
