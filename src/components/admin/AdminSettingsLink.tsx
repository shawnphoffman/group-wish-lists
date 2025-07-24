import { faLock } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { isAdmin } from '@/app/actions/users'

export default async function AdminSettingsLink() {
	const admin = await isAdmin()

	if (!admin) {
		return null
	}

	return (
		<Link
			href="/admin"
			className="flex flex-row items-center gap-1 text-red-500 transition-colors hover:text-red-600 group-hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:group-hover:text-red-300"
			title="Admin"
			prefetch={false}
		>
			<FontAwesomeIcon size="sm" icon={faLock} />
			Admin
		</Link>
	)
}
