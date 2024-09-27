import Image from 'next/image'

import { signIn } from '@/app/actions/auth'
import icon from '@/app/icon.png'
import ErrorMessage from '@/components/common/ErrorMessage'
import SignInWithAppleButton from '@/components/login/SignInWithAppleButton'
import SignInWithPassword from '@/components/login/SignInWithPassword'
import { ModeToggle } from '@/components/ModeToggle'
import { Separator } from '@/components/ui/separator'

type Props = {
	searchParams: {
		message: string
		returnUrl: string
	}
}

export default function Login({ searchParams }: Props) {
	const returnUrl = searchParams?.returnUrl
	console.log('Login', { returnUrl })
	return (
		<div className="flex flex-col items-center flex-1 w-full gap-2 px-4 py-8 xs:py-16 xs:max-w-sm">
			<ModeToggle />
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
