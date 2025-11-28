'use client'

import { useState } from 'react'
import { faPlus } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import AddGiftersDialog from '@/components/items/components/AddGiftersDialog'

type Props = {
	itemId: ListItem['id']
	initialGifterIds?: string[]
}

export default function AddGiftersButton({ itemId, initialGifterIds = [] }: Props) {
	const [dialogOpen, setDialogOpen] = useState(false)

	return (
		<>
			<Badge variant="outline" className="flex flex-row items-center px-1 leading-tight hover:text-primary">
				<button onClick={() => setDialogOpen(true)}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</Badge>
			<AddGiftersDialog itemId={itemId} open={dialogOpen} onOpenChange={setDialogOpen} initialGifterIds={initialGifterIds} />
		</>
	)
}
