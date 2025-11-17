'use client'

import { Suspense, useCallback, useState } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import AddItemForm from '@/components/items/forms/AddItemForm'
import { List, ListSharedWithMe } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
	lists: (List & { listType: 'public' | 'private' | 'gift_ideas' | 'shared_with_me' | 'shared_with_others' })[]
	list: List & { listType: 'public' | 'private' | 'gift_ideas' | 'shared_with_me' | 'shared_with_others' }
}

// Helper function to remove emojis from a string for sorting
export function removeEmojis(str: string): string {
	// Remove emojis using a regex that matches emoji Unicode ranges
	return str
		.replace(
			/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]|[\u{FE0F}]/gu,
			''
		)
		.trim()
}

export default function ImportUrlClient({ lists, list }: Props) {
	const [selectedList, setSelectedList] = useState<string>(list.id.toString())

	const handleChangeList = useCallback(value => {
		setSelectedList(value)
	}, [])

	let myPublicLists: List[] = []
	let myPrivateLists: List[] = []
	let giftIdeasList: List[] = []
	let sharedWithMeLists: List[] = []
	// let sharedWithOthersLists: List[] = []

	lists.forEach(l => {
		if (l.listType === 'public') {
			myPublicLists.push(l)
		} else if (l.listType === 'private') {
			myPrivateLists.push(l)
		} else if (l.listType === 'gift_ideas') {
			giftIdeasList.push(l)
		} else if (l.listType === 'shared_with_me') {
			sharedWithMeLists.push(l)
			// } else if (l.listType === 'shared_with_others') {
			// 	sharedWithOthersLists.push(l)
		}
	})

	myPublicLists.sort((a, b) => {
		// Primary lists always come first
		if (a.primary && !b.primary) return -1
		if (!a.primary && b.primary) return 1

		// const typeCompare = a.type.localeCompare(b.type)
		// if (typeCompare !== 0) return typeCompare
		return removeEmojis(a.name).localeCompare(removeEmojis(b.name))
	})

	myPrivateLists.sort((a, b) => {
		// Primary lists always come first
		if (a.primary && !b.primary) return -1
		if (!a.primary && b.primary) return 1

		// const typeCompare = a.type.localeCompare(b.type)
		// if (typeCompare !== 0) return typeCompare
		return removeEmojis(a.name).localeCompare(removeEmojis(b.name))
	})

	giftIdeasList.sort((a, b) => {
		// const typeCompare = a.type.localeCompare(b.type)
		// if (typeCompare !== 0) return typeCompare
		return removeEmojis(a.name).localeCompare(removeEmojis(b.name))
	})

	sharedWithMeLists.sort((a, b) => {
		// const typeCompare = a.type.localeCompare(b.type)
		// if (typeCompare !== 0) return typeCompare
		return removeEmojis(a.name).localeCompare(removeEmojis(b.name))
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
						{/* GIFT IDEAS */}
						{giftIdeasList.length > 0 && (
							<SelectGroup>
								<SelectLabel>Gift Ideas</SelectLabel>
								{giftIdeasList.map((list: List) => (
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
						{/* SHARED WITH OTHER */}
						{/* {sharedWithOthersLists.length > 0 && (
							<SelectGroup>
								<SelectLabel>My List Editors</SelectLabel>
								{sharedWithOthersLists.map((list: List) => (
									<SelectItem key={list.id} value={`${list.id}`}>
										<div className="flex flex-row items-center gap-1 text-base">
											<ListTypeIcon type={list.type} className="text-sm" />
											{list.name}
											{list.private && <> 🔒</>}
											{(list as ListSharedWithOthers).editors?.length && (
												<Badge variant="destructive" className="!text-[10px] whitespace-nowrap gap-1 px-1.5 py-0.25">
													{(list as ListSharedWithOthers).editors?.map(editor => editor.user.display_name).join(', ')}
												</Badge>
											)}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						)} */}
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
