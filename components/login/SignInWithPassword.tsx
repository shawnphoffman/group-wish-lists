'use client'

// @ts-expect-error
import { useFormStatus } from 'react-dom'

export default function SignInWithPassword() {
	const { pending } = useFormStatus()
	return (
		<fieldset disabled={pending} className="flex flex-col justify-center w-full gap-2">
			<label className="label" htmlFor="email">
				Email
			</label>
			<input className="input" name="email" placeholder="you@example.com" required />
			<label className="label" htmlFor="password">
				Password
			</label>
			<input className="input" type="password" name="password" placeholder="••••••••" required />
			<button className="btn green">{pending ? 'Signing in...' : 'Sign in'}</button>
		</fieldset>
	)
}
