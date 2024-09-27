import { redirect } from 'next/navigation'

import { getUser, signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function AuthButton() {
	const { data: currentUser } = await getUser()

	if (!currentUser) {
		return redirect('/login')
	}

	return (
		<form action={signOut}>
			<Button size="sm" variant={'outline'}>
				Logout
			</Button>
		</form>
	)
}
