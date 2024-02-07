'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { updatePassword } from '@/app/actions/auth'

import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'

type FormProps = {
	id: string
	state: {
		error?: string
		status: string
	}
}

function PasswordForm({ id, state }: FormProps) {
	const { pending } = useFormStatus()
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const passwordIsValid = useMemo(() => {
		return newPassword && confirmPassword && newPassword === confirmPassword
	}, [confirmPassword, newPassword])

	return (
		<>
			<div className="flex flex-col items-stretch gap-2 justify-stretch">
				<input type="hidden" name="user_id" value={id} readOnly />
				<div className="flex flex-col flex-1 gap-2 xs:flex-row">
					<div className="flex flex-col items-start flex-1 gap-1">
						<label className="label text-nowrap " htmlFor="new-password">
							New Password
						</label>
						<input
							className="input"
							type="password"
							name="new-password"
							disabled={pending}
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col items-start flex-1 gap-1">
						<label className="label text-nowrap" htmlFor="confirm-password">
							Confirm Password
						</label>
						<input
							className="input"
							type="password"
							name="confirm-password"
							disabled={pending}
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
				</div>
				{!pending && newPassword && confirmPassword && newPassword !== confirmPassword && (
					<ErrorMessage includeTitle={false} error={'Passwords must match'} />
				)}
				<button className="btn green" disabled={pending || !passwordIsValid}>
					{pending ? 'Changing...' : 'Change Password'}
				</button>
				{!pending && (
					<>
						{state?.error && <ErrorMessage error={state?.error} />}
						{state?.status && <SuccessMessage />}
					</>
				)}
			</div>
		</>
	)
}

type WrapperProps = {
	id: string
}

const initialState = {
	error: '',
	status: '',
}

export default function PasswordFormWrapper({ id }: WrapperProps) {
	// @ts-expect-error
	const [state, formAction] = useFormState(updatePassword, initialState)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	useEffect(() => {
		if (state?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [router, state])

	return (
		<form className=" text-foreground" action={formAction}>
			<fieldset className="flex flex-col flex-1 w-full gap-2" disabled={isPending}>
				<PasswordForm id={id} state={state} />
			</fieldset>
		</form>
	)
}
