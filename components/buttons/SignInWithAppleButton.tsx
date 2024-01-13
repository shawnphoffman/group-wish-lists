'use client'

import { createClientSideClient } from '@/utils/supabase/client'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

export default function SignInWithAppleButton() {
	const supabase = createClientSideClient()

	const handleAppleLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'apple',
			options: {
				redirectTo: process.env.NEXT_PUBLIC_AUTH_CALLBACK,
			},
		})

		if (error) {
			console.log({ error })
		}
	}

	return (
		<button type="button" className="btn white" onClick={handleAppleLogin}>
			<FontAwesomeIcon className="fa-brands fa-solid fa-apple" />
			Sign in with Apple
		</button>
	)
}
