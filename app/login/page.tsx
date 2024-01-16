import Image from 'next/image'

import icon from '@/app/icon.png'

import SignInWithAppleButton from '@/components/buttons/SignInWithAppleButton'

import { signIn } from '../actions/auth'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	return (
		<div className="flex flex-col items-center flex-1 w-full gap-2 px-8 py-16 sm:max-w-md animate-in">
			<Image src={icon} alt="Wish Lists Logo" width={200} height={200} />
			<form className="flex flex-col justify-center w-full gap-2 text-foreground" action={signIn}>
				<label className="label" htmlFor="email">
					Email
				</label>
				<input className="input" name="email" placeholder="you@example.com" required />
				<label className="label" htmlFor="password">
					Password
				</label>
				<input className="input" type="password" name="password" placeholder="••••••••" required />
				<button className="btn green">Sign in</button>
				{searchParams?.message && <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">{searchParams.message}</p>}
			</form>
			<SignInWithAppleButton />
		</div>
	)
}
