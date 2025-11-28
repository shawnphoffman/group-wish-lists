import { getGifts } from '@/app/actions/gifts'
import { getUserById } from '@/app/actions/users'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'

type Props = {
	id: ListItem['id']
	requestedQty: number
	additionalGifterIds: string[]
}

export default async function ItemGifters({ id, requestedQty = 1, additionalGifterIds = [] }: Props) {
	const gifts = await getGifts(id)

	// console.log('additionalGifterIds', additionalGifterIds)

	if (!gifts) {
		return null
	}

	const additionalGifters = await Promise.all(additionalGifterIds?.map(async g => await getUserById(g)) || [])

	return (
		<div className="flex flex-row items-center gap-1 mt-1 text-sm">
			{gifts.map(g => (
				<Badge key={g.gift_id} variant={'outline'} className="flex flex-row items-center gap-1 leading-tight">
					{g.user?.display_name}
					{requestedQty > 1 && (
						<>
							{/* <Separator orientation="vertical" className="h-3" /> */}
							<Badge
								className="h-3.5 px-1 font-mono text-[10px] rounded-full tabular-nums bg-muted text-muted-foreground"
								variant={'default'}
							>
								{g.quantity}/{requestedQty}
							</Badge>
						</>
					)}
				</Badge>
			))}
			<Suspense fallback={null}>
				{additionalGifters.map(g => (
					<Badge key={g.user_id} variant={'outline'} className="flex flex-row items-center leading-tight">
						+{g.display_name}
					</Badge>
				))}
			</Suspense>
		</div>
	)
}
