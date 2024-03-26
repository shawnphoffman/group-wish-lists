import Image from 'next/image'

import { signIn } from '@/app/actions/auth'
import icon from '@/app/icon.png'
import ErrorMessage from '@/components/common/ErrorMessage'
import SignInWithAppleButton from '@/components/login/SignInWithAppleButton'
import SignInWithPassword from '@/components/login/SignInWithPassword'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	return (
		<div className="flex flex-col items-center flex-1 w-full gap-4 px-4 py-8 xs:py-16 xs:max-w-sm animate-in">
			<Image src={icon} alt="Wish Lists Logo" width={200} height={200} />
			<form className="flex flex-col justify-center w-full" action={signIn}>
				<SignInWithPassword />
			</form>
			{searchParams?.message && <ErrorMessage error={searchParams.message} includeTitle={false} className="w-full !p-2" />}
			<SignInWithAppleButton />
		</div>
	)
}
