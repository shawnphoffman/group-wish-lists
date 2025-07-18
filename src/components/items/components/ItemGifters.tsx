import { getGifts } from '@/app/actions/gifts'
import { ListItem } from '@/components/types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Props = {
	id: ListItem['id']
	requestedQty: number
}

export default async function ItemGifters({ id, requestedQty = 1 }: Props) {
	const gifts = await getGifts(id)

	console.log('gifts', gifts)

	if (!gifts) {
		return null
	}

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
		</div>
	)
}
