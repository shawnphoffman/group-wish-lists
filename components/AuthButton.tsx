import Link from 'next/link'

import { getUser, signOut } from '@/app/actions/auth'

export default async function AuthButton() {
	const { data: currentUser } = await getUser()

	if (!currentUser) {
		return (
			<Link href="/login" className="nav-btn red">
				Login
			</Link>
		)
	}

	return (
		<div className="flex items-center gap-4">
			<span className="hidden sm:block">Hey, {currentUser.display_name || currentUser.email}!</span>
			<form action={signOut}>
				<button className="nav-btn red">Logout</button>
			</form>
		</div>
	)
}
