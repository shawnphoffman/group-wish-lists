import Link from 'next/link'

import { getUser, signOut } from '@/app/actions/auth'

export default async function AuthButton() {
	const { data } = await getUser()

	const email = data?.user?.email
	const name = data?.user?.user_metadata?.name

	return data?.user ? (
		<div className="flex items-center gap-4">
			<span className="hidden sm:block">Hey, {name || email}!</span>
			<form action={signOut}>
				<button className="nav-btn red">Logout</button>
			</form>
		</div>
	) : (
		<Link href="/login" className={'nav-btn red'}>
			Login
		</Link>
	)
}
