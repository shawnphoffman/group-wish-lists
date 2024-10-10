import { getUser } from '@/app/actions/auth'
import { Badge } from '@/components/ui/badge'

export default async function UserBadge() {
	const { data: currentUser } = await getUser()

	if (!currentUser?.display_name) {
		return null
	}

	return (
		<Badge variant="outline" className="items-center hidden sm:flex text-accent-foreground bg-accent">
			<span>{currentUser?.display_name}</span>
		</Badge>
	)
}
