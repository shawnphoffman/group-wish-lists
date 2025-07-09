import Image from 'next/image'
import { redirect } from 'next/navigation'

import { getSessionUser, signIn } from '@/app/actions/auth'
import icon from '@/app/icon.png'
import ErrorMessage from '@/components/common/ErrorMessage'
import SignInWithAppleButton from '@/components/login/SignInWithAppleButton'
import SignInWithPassword from '@/components/login/SignInWithPassword'
import { Separator } from '@/components/ui/separator'

type Props = {
	searchParams: Promise<{
		message: string
		returnUrl: string
	}>
}

export default async function Login(props: Props) {
	const searchParams = await props.searchParams
	const returnUrl = searchParams?.returnUrl

	const currentUser = await getSessionUser()

	if (currentUser) {
		// console.log('Login: already logged in', currentUser)
		return redirect(returnUrl || '/')
	}

	return (
		<div className="flex flex-col items-center flex-1 w-full gap-2 px-4 py-8 xs:py-16 xs:max-w-sm animate-page-in">
			<Image src={icon} alt="Wish Lists Logo" width={200} height={200} />
			<form className="flex flex-col justify-center w-full" action={signIn}>
				<input type="hidden" name="returnUrl" value={returnUrl} />
				<SignInWithPassword />
			</form>

			<Separator className="my-4" />
			<SignInWithAppleButton />
			{searchParams?.message && <ErrorMessage error={searchParams.message} includeTitle={false} className="w-full !p-2" />}
		</div>
	)
}
