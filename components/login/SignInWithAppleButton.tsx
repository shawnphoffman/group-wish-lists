'use client'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { createClientSideClient } from '@/utils/supabase/client'

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
