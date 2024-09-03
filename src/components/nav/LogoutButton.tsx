import { getUser, signOut } from '@/app/actions/auth'
import Badge from '@/components/common/Badge'

export default async function LogoutButton() {
	const { data: currentUser } = await getUser()

	// if (!currentUser) return null

	return (
		<div className="flex items-center gap-2 max-xs:gap-1">
			<Badge colorId={currentUser?.id} className="!text-base">
				<span className="hidden sm:inline">{currentUser?.display_name}</span>
				<span className="inline text-lg max-xs:text-base sm:hidden">{currentUser?.display_name.charAt(0)}</span>
			</Badge>
			<form action={signOut}>
				<button className="nav-btn red max-xs:!px-2">Logout</button>
			</form>
		</div>
	)
}
