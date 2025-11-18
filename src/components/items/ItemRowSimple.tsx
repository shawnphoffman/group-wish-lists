import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'
import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import { Badge } from '@/components/ui/badge'
import { formatDateBasedOnAge } from '@/utils/date'
import { ItemPriority, ItemStatus } from '@/utils/enums'

import AddCommentButton from '../comments/AddCommentButton'
import ItemComments from '../comments/ItemComments'

import MarkdownBlock from './components/MarkdownBlock'
import ItemRowActions from './ItemRowActions'
import { formatDistance } from 'date-fns/formatDistance'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type Props = {
	// item: ListItem & Gift
	item: any
}

export default async function ItemRowSimple({ item }: Props) {
	if (!item) return null

	if (item.archived) return null

	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	// const usersPromise = getUsers()
	const [currentUser] = await Promise.all([
		userPromise,
		// usersPromise,
		// fakePromise
	])

	// console.log('ListItemSimple', { item })

	return (
		<div className={`flex flex-col w-full gap-2 p-3 hover:bg-muted`} id={`item-${item.id}`}>
			<div className="flex flex-col w-full gap-2">
				<div className="flex flex-row items-stretch gap-x-3.5">
					{/* Priority */}
					<div className="flex flex-col items-center justify-center gap-2 shrink-0">
						{/* Priority */}
						{item.priority !== ItemPriority.Normal && <ItemPriorityIcon priority={item.priority} />}
					</div>
					{/*  */}
					<div className="flex max-[400px]:flex-col min-[401px]:items-center flex-1 gap-2 xs:flex-row md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
							<div className="flex flex-row items-start flex-1 gap-1 overflow-hidden font-medium">
								{/* Title */}
								{item.url ? (
									<Link
										href={item.url!}
										// target="_blank"
										className={`flex flex-col gap-0.5 overflow-hidden hover:underline`}
									>
										{item.title}
										{/* <div className="flex flex-row items-center gap-1">
											<FontAwesomeIcon
												icon={faLink}
												className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
												size="xs"
											/>
											<span className="flex text-xs text-muted-foreground">{getDomainFromUrl(item.url)}</span>
										</div> */}
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
							<div className="flex flex-col gap-2 xs:items-center xs:flex-row">
								<Avatar className="w-5 h-5 border border-foreground">
									<AvatarImage src={item?.user?.image} />
									<AvatarFallback className="text-xl font-bold bg-background text-foreground">
										{item.user.display_name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<Badge variant="outline" className="text-muted-foreground whitespace-nowrap w-fit">
									{item.user.display_name}
								</Badge>
								{item.created_at && (
									<div
										className="text-xs italic break-words whitespace-pre-line text-muted-foreground/50"
										title={formatDateBasedOnAge(item.updated_at)}
									>
										Updated: {formatDistance(new Date(item.updated_at), new Date(), { addSuffix: true })}
									</div>
								)}
							</div>
						</div>

						{/* Image + Actions */}
						<div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
							{/* Image */}
							<ItemImage url={item.image_url} className="max-[400px]:w-40 max-[400px]:max-h-40 w-16 max-h-16 xs:w-24 xs:max-h-24" />
							{/* <div className="flex flex-col items-center justify-center gap-2"> */}
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
