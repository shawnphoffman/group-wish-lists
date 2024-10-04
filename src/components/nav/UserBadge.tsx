import { getUser } from '@/app/actions/auth'
import { Badge } from '@/components/ui/badge'

export default async function UserBadge() {
	const { data: currentUser } = await getUser()

	return (
		<Badge variant="outline" className="items-center hidden md:flex text-accent-foreground bg-accent">
			<span>{currentUser?.display_name}</span>
		</Badge>
	)
}