'use client'

import { faApple } from '@awesome.me/kit-f973af7de0/icons/classic/brands'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
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
		<Button type="button" className="items-center w-full gap-1" variant={'outline'} onClick={handleClick}>
			<FontAwesomeIcon icon={faApple} size="sm" />
			<span className="leading-none">Link with Apple</span>
		</Button>
	)
}
