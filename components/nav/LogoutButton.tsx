import { getUser, signOut } from '@/app/actions/auth'

import Badge from '../common/Badge'

export default async function LogoutButton() {
	const { data: currentUser } = await getUser()

	if (!currentUser) return null

	return (
		<div className="flex items-center gap-4">
			<Badge colorLabel={currentUser.display_name} className="!text-sm">
				<span className="hidden xs:inline">{currentUser.display_name}</span>
				<span className="inline xs:hidden">{currentUser.display_name.charAt(0)}</span>
			</Badge>
			<form action={signOut}>
				<button className="nav-btn red">Logout</button>
			</form>
		</div>
	)
}
