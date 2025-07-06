import { getUser } from '@/app/actions/auth'
import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default async function UserBadge() {
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const { data: currentUser } = await getUser()

	if (!currentUser?.display_name) {
		return null
	}

	return (
		<>
			{currentUser?.image ? (
				<Avatar className="border w-9 h-9 border-input">
					<AvatarImage src={currentUser?.image} />
					<AvatarFallback>{currentUser?.display_name?.charAt(0)}</AvatarFallback>
				</Avatar>
			) : (
				<Badge variant="outline" className="items-center hidden sm:flex text-accent-foreground bg-accent whitespace-nowrap">
					<span>{currentUser?.display_name}</span>
				</Badge>
			)}
		</>
	)
}
