import Link from 'next/link'

import { getUser, signOut } from '@/app/actions/auth'

const buttonClasses =
	'py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'

export default async function AuthButton() {
	const { data } = await getUser()

	const email = data?.user?.email
	const name = data?.user?.user_metadata?.name

	return data?.user ? (
		<div className="flex items-center gap-4">
			Hey, {name || email}!
			<form action={signOut}>
				<button className={buttonClasses}>Logout</button>
			</form>
		</div>
	) : (
		<Link href="/login" className={buttonClasses}>
			Login
		</Link>
	)
}
