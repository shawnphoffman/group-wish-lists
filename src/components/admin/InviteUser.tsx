'use client'

import { startTransition, useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'

import ErrorMessage from '../common/ErrorMessage'
import SuccessMessage from '../common/SuccessMessage'

import { inviteUser } from '@/app/(core)/admin/actions'

function InviteUserFields() {
	const { pending } = useFormStatus()
	return (
		<fieldset disabled={pending} className="flex flex-col justify-center w-full gap-2">
			<label className="label" htmlFor="email">
				Email
			</label>
			<input className="input" name="email" placeholder="you@example.com" required />
			<button className="btn green">{pending ? 'Inviting...' : 'Invite User'}</button>
		</fieldset>
	)
}

export default function InviteUserForm() {
	// @ts-expect-error
	const [state, formAction] = useFormState(inviteUser, {})
	const router = useRouter()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		console.log('state', state)
		if (state?.status === 'success') {
			startTransition(() => {
				if (formRef?.current) {
					formRef.current.reset()
				}
				router.refresh()
			})
		}
	}, [state, router])

	return (
		<form className="flex flex-col justify-center w-full gap-2" action={formAction}>
			<InviteUserFields />
			{state?.error && <ErrorMessage error={state?.error?.message} />}
			{state?.status === 'success' && <SuccessMessage />}
		</form>
	)
}
