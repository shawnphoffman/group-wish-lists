'use client'

import { faApple } from '@awesome.me/kit-f973af7de0/icons/classic/brands'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
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
		<Button className="items-center w-full gap-1" variant={'outline'} onClick={handleAppleLogin}>
			<FontAwesomeIcon icon={faApple} size="sm" />
			<span className="leading-none">Sign in with Apple</span>
		</Button>
	)
}
