'use client'

import { createClientSideClient } from '@/utils/supabase/client'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

export default function SignInWithAppleButton() {
	const supabase = createClientSideClient()

	const handleAppleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'apple',
			options: {
				redirectTo: process.env.NEXT_PUBLIC_AUTH_CALLBACK,
			},
		})
	}

	return (
		<button type="button" className="w-full btn white" onClick={handleAppleLogin}>
			<FontAwesomeIcon className="fa-brands fa-solid fa-apple" />
			Sign in with Apple
		</button>
	)
}
