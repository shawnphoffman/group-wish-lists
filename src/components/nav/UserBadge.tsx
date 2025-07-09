import { getUser } from '@/app/actions/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function UserBadge() {
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const { data: currentUser } = await getUser()

	if (!currentUser?.display_name) {
		return null
	}

	return (
		<div className="transition-all will-change-auto hover:scale-105">
			<Avatar className="transition-colors border w-9 h-9 will-change-auto border-foreground hover:border-primary">
				<AvatarImage src={currentUser?.image} />
				<AvatarFallback className="font-bold">{currentUser?.display_name?.charAt(0)}</AvatarFallback>
			</Avatar>
		</div>
	)
}
