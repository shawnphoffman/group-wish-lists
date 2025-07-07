import { redirect } from 'next/navigation'

import { getSessionUser } from '@/app/actions/auth'

export default async function AuthButton() {
	const currentUser = await getSessionUser()

	if (!currentUser) {
		return redirect('/auth/login')
	}

	return null
}
