import { faRightFromBracket } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { redirect } from 'next/navigation'

import { getSessionUser, signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function AuthButton() {
	const currentUser = await getSessionUser()

	if (!currentUser) {
		return redirect('/login')
	}

	return (
		<form action={signOut}>
			<Button size="sm" variant={'outline'} className="px-2 sm:px-3">
				<span className="hidden sm:flex">Logout</span>
				<span className="flex sm:hidden">
					<FontAwesomeIcon icon={faRightFromBracket} />
				</span>
			</Button>
		</form>
	)
}
