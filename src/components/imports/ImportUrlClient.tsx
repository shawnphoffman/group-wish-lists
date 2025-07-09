'use client'

import { Suspense, useCallback, useState } from 'react'

// import { faLockKeyhole } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FallbackRow from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import AddItemForm from '@/components/items/forms/AddItemForm'
import { List, ListSharedWithMe } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ImportUrlClient({ lists, list }: { lists: List[]; list: List }) {
	const [selectedList, setSelectedList] = useState<string>(list.id.toString())

	const handleChangeList = useCallback(value => {
		setSelectedList(value)
	}, [])

	// console.log('lists', lists)

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
				<Label htmlFor="list">List</Label>
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
													{/* <FontAwesomeIcon icon={faLockKeyhole} size="sm" />  */}
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
					<AddItemForm listId={parseInt(selectedList)} />
				</div>
			</Suspense>
		</>
	)
}
