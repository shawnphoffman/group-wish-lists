'use client'

// import ErrorMessage from '@/components/common/ErrorMessage'
import { useState } from 'react'

import SuccessMessage from '@/components/common/SuccessMessage'
import { createClientSideClient } from '@/utils/supabase/client'

export default function PasswordResetButton({ email }: { email: string }) {
	const supabase = createClientSideClient()

	const [showSuccess, setShowSuccess] = useState(false)

	const handleClick = async () => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: '/reset-password',
		})
		console.log(data, error)
		if (data) {
			setShowSuccess(true)
		}
	}

	return (
		<>
			<button type="button" className="btn red" onClick={handleClick}>
				Reset Your Password
			</button>
			{showSuccess && <SuccessMessage message={'Check your email for a password reset link'} />}
		</>
	)
}
