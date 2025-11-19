'use client'

import { Button } from '@/components/ui/button'
import { EmailIcon } from '@/components/icons/Icons'

import { sendEmail } from '@/app/(core)/admin/actions'
import { useCallback, useEffect, useState } from 'react'
import { CheckIcon, XIcon } from 'lucide-react'

export default function AdminSendTestEmailButton() {
	const [sending, setSending] = useState(false)
	const [result, setResult] = useState<{ status?: string; error?: string }>()

	const Icon = !result || sending ? <EmailIcon /> : result?.status === 'success' ? <CheckIcon /> : <XIcon />

	// useEffect(() => {
	// 	if (result?.status) {
	// 	}
	// }, [result])

	const handleClick = useCallback(async () => {
		setSending(true)
		const resp = await sendEmail()
		setSending(false)
		if ('error' in resp && resp.error) {
			setResult({
				status: (resp as any).status,
				error: typeof (resp as any).error === 'string' ? (resp as any).error : ((resp as any).error?.message ?? 'Unknown error'),
			})
		} else {
			setResult({
				status: (resp as any).status,
				error: undefined,
			})
		}
		setTimeout(() => {
			setResult(undefined)
		}, 3000)
	}, [])

	return (
		<Button onClick={handleClick} variant="outline" className="gap-2 group" disabled={sending}>
			{Icon}
			Send Test Email
		</Button>
	)
}
