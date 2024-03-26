'use client'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
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
			<FontAwesomeIcon className="fa-brands fa-solid fa-apple" />
			Link with Apple
		</button>
	)
}
