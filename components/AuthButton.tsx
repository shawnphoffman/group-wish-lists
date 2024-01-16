import Link from 'next/link'

import { getUser, signOut } from '@/app/actions/auth'

import Badge from './Badge'

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
			<Badge colorLabel={currentUser.display_name} className="!text-sm">
				{currentUser.display_name}
			</Badge>
			<form action={signOut}>
				<button className="nav-btn red">Logout</button>
			</form>
		</div>
	)
}
