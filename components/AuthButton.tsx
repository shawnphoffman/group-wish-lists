import Link from 'next/link'

import { getUser, signOut } from '@/app/actions'

export default async function AuthButton() {
	const { data } = await getUser()

	return data?.user ? (
		<div className="flex items-center gap-4">
			Hey, {data.user.email}!
			<form action={signOut}>
				<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">Logout</button>
			</form>
		</div>
	) : (
		<Link href="/login" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
			Login
		</Link>
	)
}
