'use client'

import { useCallback, useState } from 'react'
import { faLink } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ItemPriorityIcon from '@/components/icons/PriorityIcon'
import ItemImage from '@/components/items/components/ItemImage'
import { ListItem } from '@/components/types'
// import { Badge } from '@/components/ui/badge'
import { getDomainFromUrl } from '@/utils/urls'

// import ItemComments from '../comments/ItemComments'
import { Checkbox } from '../ui/checkbox'

type Props = {
	item: ListItem
	onSelect?: (selected: boolean) => void
}

export default function ItemRowSelectable({ item, onSelect }: Props) {
	const [isSelected, setIsSelected] = useState(false)

	const handleSelect = useCallback(
		(checked: boolean) => {
			setIsSelected(checked)
			onSelect?.(checked)
		},
		[onSelect]
	)
	if (!item) return null

	if (item.archived) return null

	return (
		<div
			id={`item-${item.id}`}
			className={`${isSelected ? 'bg-muted' : ''} p-3 hover:bg-muted font-medium leading-normal gap-2 flex flex-col`}
		>
			<div className="flex flex-col w-full gap-2 divide-y divide-border ">
				<div className="flex flex-row gap-x-3.5 items-center">
					<div className="flex flex-col items-center justify-center gap-2 xs:flex-row shrink-0">
						{/* Checkbox */}
						<Checkbox checked={isSelected} onCheckedChange={handleSelect} className="w-5 h-5" />
						{/* Priority */}
						{item.priority !== 'normal' && (
							<div className="flex flex-col items-center justify-center max-w-4 shrink-0">
								<ItemPriorityIcon priority={item.priority} />
							</div>
						)}
					</div>
					{/*  */}
					<div className="flex flex-col flex-1 w-full gap-2 overflow-hidden xs:items-center xs:flex-row md:gap-4">
						{/* Title + Notes */}
						<div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
							<div className="flex flex-row items-center flex-1 gap-1 overflow-hidden font-medium">
								{/* Title */}
								{item.url ? (
									<div className={`flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 overflow-hidden`}>
										{item.title}
										<Link href={item.url!} target="_blank" className="flex flex-row items-center gap-1 hover:underline">
											<FontAwesomeIcon
												icon={faLink}
												className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
												size="xs"
											/>
											<span className="flex text-xs text-muted-foreground">{getDomainFromUrl(item.url)}</span>
										</Link>
									</div>
								) : (
									<div>{item.title}</div>
								)}
								{/* {item.price && (
									<Badge variant="outline" className="whitespace-nowrap bg-card h-5 w-fit px-1.5 ml-2 text-[10px]">
										~{item.price}
									</Badge>
								)} */}
							</div>
							{/* Notes */}
							{/* {item.notes && (
								//
								<div className="inline-flex flex-col gap-0 text-sm text-foreground/75">
									<MarkdownBlock>{item.notes}</MarkdownBlock>
								</div>
							)} */}
						</div>
						{/* Image + Actions */}
						<div className="flex-row items-center justify-center hidden gap-1 xs:flex-col sm:flex-row xs:flex">
							<ItemImage url={item.image_url} className="h-fit max-w-12 xs:w-24 xs:max-h-24" />
						</div>
					</div>
				</div>
			</div>

			{/* {item?.item_comments && <ItemComments comments={item.item_comments} />} */}
		</div>
	)
}
