import { faLink } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'
import { OpenUrlIcon } from '@/components/icons/Icons'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemCheckbox from '@/components/items/components/ItemCheckbox'
import ItemImage from '@/components/items/components/ItemImage'
import { Gift, ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { ItemPriority, ItemStatus } from '@/utils/enums'

import AddCommentButton from '../comments/AddCommentButton'
import ItemComments from '../comments/ItemComments'

type Props = {
	item: ListItem & Gift
	isOwnerView: boolean
}

export default async function ItemRow({ item, isOwnerView }: Props) {
	if (!item) return null

	if (item.archived) return null

	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const [currentUser] = await Promise.all([
		userPromise,
		// fakePromise
	])

	// console.log('ListItemRow', item)

	const isComplete = !isOwnerView && item.status === ItemStatus.Complete
	const userCanChange = item?.gifter_user_id === currentUser?.id || item.status !== ItemStatus.Complete

	const completeClass = isComplete ? (userCanChange ? 'opacity-75' : 'opacity-50') : ''

	return (
		<div className={`flex flex-col w-full gap-2 p-3 hover:bg-muted ${completeClass}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority & Checkbox */}
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						{item.priority !== ItemPriority.Normal && <ItemPriorityIcon priority={item.priority} />}
						{/* Checkbox */}
						{!isOwnerView && <ItemCheckbox id={item.id} isComplete={isComplete} canChange={userCanChange} />}
					</div>
					{/*  */}
					<div className="flex flex-row items-center flex-1 gap-2 md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-1 overflow-hidden">
							<div className="flex flex-row items-center flex-1 gap-1 overflow-hidden">
								{/* Title */}
								{item.url ? (
									<Link href={item.url!} target="_blank" className={`flex flex-1 items-center gap-1 overflow-hidden hover:underline`}>
										{item.title}
										<FontAwesomeIcon
											icon={faLink}
											className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
											size="xs"
										/>
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

							{/* Gifter */}
							{isComplete && (
								<Badge variant={'outline'} className="self-start mt-1">
									{item.display_name}
								</Badge>
							)}
						</div>

						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="w-16 max-h-16 xs:w-24 xs:max-h-24" />
							<div className="flex flex-col items-center justify-center gap-2">
								{/* Actions */}
								{/* {item.url && (
									<Link href={item.url} target="_blank" className="nav-btn teal">
										<OpenUrlIcon />
										<span className="inline text-sm sm:hidden">Link</span>
									</Link>
								)} */}
								{!isComplete && <AddCommentButton itemId={item.id} />}
							</div>
						</div>
					</div>
				</div>
			</div>
			{!isComplete && item?.item_comments && <ItemComments comments={item.item_comments} />}
		</div>
	)
}
