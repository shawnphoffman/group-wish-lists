import { faLock } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'

import { isAdmin } from '@/app/actions/users'
import { NavItem } from '../sidebar/nav-section'

export default async function AdminNavLink() {
	const admin = await isAdmin()

	if (!admin) {
		return null
	}
	const item: NavItem = {
		name: 'Admin',
		url: '/admin',
		icon: faLock,
	}

	return <NavItem item={item} className="text-red-500 transition-colors hover:text-red-400" />
}
