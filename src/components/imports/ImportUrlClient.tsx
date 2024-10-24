'use client'

import { Suspense, useCallback, useState } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import AddItemForm from '@/components/items/forms/AddItemForm'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { List } from '../types'

export default function ImportUrlClient({ lists, list }: { lists: List[]; list: List }) {
	const [selectedList, setSelectedList] = useState<string>(list.id.toString())

	const handleChangeList = useCallback(value => {
		setSelectedList(value)
	}, [])

	return (
		<>
			<div className="grid w-full gap-1.5">
				<Label htmlFor="list">List</Label>
				<Select name="list" value={selectedList} onValueChange={handleChangeList}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{lists.map((list: List) => (
							<SelectItem key={list.id} value={`${list.id}`}>
								{list.name}
								{list.private && <> 🔒</>}
								{list.primary && <> ⭐</>}
							</SelectItem>
						))}
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
