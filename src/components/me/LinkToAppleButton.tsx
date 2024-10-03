'use client'

import { faApple } from '@awesome.me/kit-ac8ad9255a/icons/classic/brands'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { createClientSideClient } from '@/utils/supabase/client'

export default function LinkToAppleButton() {
	const supabase = createClientSideClient()

	const handleClick = async () => {
		await supabase.auth.linkIdentity({
			provider: 'apple',
			options: {
				redirectTo: process.env.NEXT_PUBLIC_AUTH_CALLBACK,
			},
		})
	}

	return (
		<button type="button" className="w-full btn white" onClick={handleClick}>
			<FontAwesomeIcon icon={faApple} />
			Link with Apple
		</button>
	)
}
