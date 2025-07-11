'use client'

import { Suspense, useCallback, useState } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { List, ListItem, ListSharedWithMe } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import CloneItemFormFields from './CloneItemFormFields'

type Props = {
	lists: List[]
	list: List
	item: ListItem
}

export default function CloneItemForm({ lists, list, item }: Props) {
	const [selectedList, setSelectedList] = useState<string>(list.id.toString())

	const handleChangeList = useCallback(value => {
		setSelectedList(value)
	}, [])

	let myPublicLists: List[] = []
	let myPrivateLists: List[] = []
	let sharedWithMeLists: List[] = []

	lists.forEach(l => {
		if ((l as ListSharedWithMe).sharer_id) {
			sharedWithMeLists.push(l)
		} else if (l.private) {
			myPrivateLists.push(l)
		} else {
			myPublicLists.push(l)
		}
	})

	myPrivateLists.sort((a, b) => {
		const typeCompare = a.type.localeCompare(b.type)
		if (typeCompare !== 0) return typeCompare
		return a.name.localeCompare(b.name)
	})

	sharedWithMeLists.sort((a, b) => {
		const typeCompare = a.type.localeCompare(b.type)
		if (typeCompare !== 0) return typeCompare
		return a.name.localeCompare(b.name)
	})

	return (
		<>
			<div className="grid w-full gap-1.5">
				<Label htmlFor="list">Select List to Clone To</Label>
				<Select name="list" value={selectedList} onValueChange={handleChangeList}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{/* MY PUBLIC LISTS */}
						{myPublicLists.length > 0 && (
							<SelectGroup>
								<SelectLabel>My Public Lists</SelectLabel>
								{myPublicLists.map((list: List) => (
									<SelectItem key={list.id} value={`${list.id}`}>
										<div className="flex flex-row items-center gap-1 text-base">
											<ListTypeIcon type={list.type} className="text-sm" />
											{list.name}
											{list.private && <> 🔒</>}
											{list.primary && <> ⭐</>}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						)}
						{/* MY PRIVATE LISTS */}
						{myPrivateLists.length > 0 && (
							<SelectGroup>
								<SelectLabel>My Private Lists</SelectLabel>
								{myPrivateLists.map((list: List) => (
									<SelectItem key={list.id} value={`${list.id}`}>
										<div className="flex flex-row items-center gap-1 text-base">
											<ListTypeIcon type={list.type} className="text-sm" />
											{list.name}
											{list.private && <> 🔒</>}
											{list.primary && <> ⭐</>}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						)}
						{/* SHARED WITH ME */}
						{sharedWithMeLists.length > 0 && (
							<SelectGroup>
								<SelectLabel>Lists I Can Edit</SelectLabel>
								{sharedWithMeLists.map((list: List) => (
									<SelectItem key={list.id} value={`${list.id}`}>
										<div className="flex flex-row items-center gap-1 text-base">
											<ListTypeIcon type={list.type} className="text-sm" />
											{list.name}
											{list.private && <> 🔒</>}
											{(list as ListSharedWithMe).sharer_display_name && (
												<Badge variant="destructive" className="!text-[10px] whitespace-nowrap gap-1 px-1.5 py-0.25">
													{(list as ListSharedWithMe).sharer_display_name}
												</Badge>
											)}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						)}
					</SelectContent>
				</Select>
			</div>

			<Suspense fallback={<FallbackRow />}>
				<div className="flex flex-col items-stretch gap-2">
					<CloneItemFormFields listId={parseInt(selectedList)} item={item} />
				</div>
			</Suspense>
		</>
	)
}
