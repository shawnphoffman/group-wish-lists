import { faListCheck } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistance } from 'date-fns/formatDistance'
import Link from 'next/link'

import { getSessionUser } from '@/app/actions/auth'
import { getRecentItems } from '@/app/actions/items'
import ErrorMessage from '@/components/common/ErrorMessage'
import { Card, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDateBasedOnAge } from '@/utils/date'

// import ItemPriorityIcon from '../icons/PriorityIcon'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import ItemImage from './components/ItemImage'

export default async function RecentItems() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const userPromise = getSessionUser()
	const itemsPromise = getRecentItems()

	const [currentUser, { data, error }] = await Promise.all([
		userPromise,
		itemsPromise,
		// fakePromise
	])

	// console.log('RecentItems', { data, error })

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{data?.map(item => {
					const url =
						item.lists.recipient_user_id === currentUser?.id
							? `/lists/${item.lists.id}/edit#item-${item.id}`
							: `/lists/${item.lists.id}#item-${item.id}`
					// console.log('RecentItems', item)
					return (
						<Card key={`group-${item.id}`} className="bg-accent">
							<CardHeader className="flex-col items-center gap-1 py-4 pb-4">
								<div className="flex flex-col items-center justify-between w-full gap-2 xs:flex-row">
									<div className="flex flex-row items-center justify-center w-full gap-2 max-xs:self-start">
										{/* <ItemPriorityIcon priority={item.priority} /> */}
										<div className="flex flex-col items-start flex-1 gap-2">
											<h3 className="leading-none text-ellipsis">{item.title}</h3>
											<div className="flex flex-col gap-2 xs:items-center xs:flex-row">
												<Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
													{item.user.display_name}
													{/* - {item.lists.name} */}
												</Badge>
												{item.created_at && (
													<div
														className="text-xs italic break-words whitespace-pre-line text-muted-foreground/50"
														title={formatDateBasedOnAge(item.created_at)}
													>
														Added: {formatDistance(new Date(item.created_at), new Date(), { addSuffix: true })}
													</div>
												)}
											</div>
										</div>
										<ItemImage url={item.image_url} className="w-16 border-none max-h-16" />
									</div>
									<div className="flex flex-row gap-2 max-xs:self-end">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger className={`leading-none text-ellipsis whitespace-nowrap overflow-hidden`}>
													<Button variant="ghost" type="button" size="icon" className="group" asChild>
														<Link href={url} className="">
															<FontAwesomeIcon
																icon={faListCheck}
																size="lg"
																className="text-red-500 hover:text-red-600 group-hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:group-hover:text-red-300"
															/>
														</Link>
													</Button>
												</TooltipTrigger>
												<TooltipContent className="max-w-60 text-pretty">{item.lists.name}</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</div>
							</CardHeader>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
