import { faLink } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import AddCommentButton from '@/components/comments/AddCommentButton'
import ItemComments from '@/components/comments/ItemComments'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import AddGiftersButton from '@/components/items/components/AddGiftersButton'
import ItemCheckboxClient from '@/components/items/components/ItemCheckboxClient'
import ItemImage from '@/components/items/components/ItemImage'
import MarkdownBlock from '@/components/items/components/MarkdownBlock'
import ItemRowActions from '@/components/items/ItemRowActions'
import { Gift, ListItem, User } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority, ItemStatus } from '@/utils/enums'
import { getDomainFromUrl } from '@/utils/urls'

type ItemWithGifts = ListItem &
	Gift & {
		gifts?: any[]
	}

type Props = {
	item: ItemWithGifts
	isOwnerView: boolean
	currentUser: any
	users: User[]
}

export default function ItemRowSSR({ item, isOwnerView, currentUser, users }: Props) {
	if (!item) return null
	if (item.archived) return null

	// const isComplete = !isOwnerView && item.status === ItemStatus.Complete
	const completeClass = ''

	const gifts = item.gifts || []
	const additionalGifterIds =
		gifts
			.map(gift => gift.additional_gifter_ids)
			?.flat()
			.filter(Boolean) || []
	const additionalGifters = additionalGifterIds?.map(gifterId => users.find(u => u.user_id === gifterId))
	const currentGifterIds = [...new Set(gifts.map(gift => gift.gifter_id).concat(additionalGifterIds))]
	const isCurrentGifter = currentGifterIds.includes(currentUser.id)

	return (
		<div className={`flex flex-col w-full gap-2 p-3 hover:bg-muted ${completeClass}`} id={`item-${item.id}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority & Checkbox */}
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						{item.priority !== ItemPriority.Normal && <ItemPriorityIcon priority={item.priority} />}
						{/* Checkbox */}
						{!isOwnerView && currentUser && (
							<ItemCheckboxClient
								id={item.id}
								status={item.status}
								requestedQty={item.quantity || 1}
								currentUserId={currentUser.id}
								gifts={item.gifts || []}
							/>
						)}
					</div>
					{/*  */}
					<div className="flex max-[400px]:flex-col min-[401px]:items-center flex-1 gap-2 xs:flex-row md:gap-4">
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
										{item.price}
									</Badge>
								)}

								{item.quantity && item.quantity > 1 && (
									<Badge variant="outline" className="px-2 text-xs whitespace-nowrap bg-card w-fit">
										Qty: {item.quantity}
									</Badge>
								)}
								{item.status === ItemStatus.Unavailable && (
									<Badge className="h-4 px-2 text-xs whitespace-nowrap bg-destructive text-destructive-foreground w-fit">Unavailable</Badge>
								)}
							</div>

							{/* Notes */}
							{item.notes && (
								<div className="inline-flex flex-col gap-0 text-sm text-foreground/75">
									<MarkdownBlock>{item.notes}</MarkdownBlock>
								</div>
							)}
							{item.created_at && (
								<div className="text-xs italic break-words whitespace-pre-line text-muted-foreground/50">
									Added: {formatDateBasedOnAge(item.created_at)}
								</div>
							)}

							{/* Gifter - simplified for client component */}
							{!isOwnerView && item.gifts && item.gifts.length > 0 && (
								<div className="flex flex-row items-center gap-1 mt-1 text-sm">
									{item.gifts.map((gift: any, index: number) => (
										<Badge key={index} variant="outline" className="flex flex-row items-center leading-tight">
											{gift.user?.display_name || 'Anonymous'}
										</Badge>
									))}
									{additionalGifters.map((gifter: any, index: number) => (
										<Badge key={index} variant="outline" className="flex flex-row items-center leading-tight">
											{gifter.display_name}
										</Badge>
									))}
									{isCurrentGifter && <AddGiftersButton itemId={item.id} initialGifterIds={additionalGifterIds} />}
								</div>
							)}
						</div>

						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="max-[400px]:w-40 max-[400px]:max-h-40 w-16 max-h-16 xs:w-24 xs:max-h-24" />
							<div className="flex flex-row-reverse items-center justify-center gap-1 sm:flex-col">
								{/* Actions */}
								<ItemRowActions itemId={item.id} status={item.status} additionalGifterIds={item.additional_gifter_ids} />
								<AddCommentButton itemId={item.id} />
							</div>
						</div>
					</div>
				</div>
			</div>
			{item?.item_comments && <ItemComments comments={item.item_comments} />}
		</div>
	)
}
