'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
// @ts-expect-error
import { useFormState, useFormStatus } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'

type FormProps = {
	name: string
	id: string
	state: {
		error: string
		status: string
	}
}

function PasswordForm({ name, id, state }: FormProps) {
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
				<div className="flex flex-col flex-1 gap-2">
					<div className="flex flex-row items-center flex-1 gap-1">
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
					<div className="flex flex-row items-center flex-1 gap-1">
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
					{!pending && newPassword && confirmPassword && newPassword !== confirmPassword && (
						<ErrorMessage includeTitle={false} error={'Passwords must match'} />
					)}
				</div>
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
	name: string
	id: string
}

const initialState = {
	error: '',
	status: '',
}

export default function PasswordFormWrapper({ name, id }: WrapperProps) {
	const [state, formAction] = useFormState(updateProfile, initialState)
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
				<PasswordForm name={name} id={id} state={state} />
			</fieldset>
		</form>
	)
}
