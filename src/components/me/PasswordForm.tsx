'use client'

import { useActionState, useEffect, useMemo, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

import { updatePassword } from '@/app/actions/auth'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="new-password">New Password</Label>
					<Input
						className="text-base tracking-[4px]"
						type="password"
						name="new-password"
						placeholder=""
						disabled={pending}
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						required
					/>
				</div>

				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="confirm-password">Confirm Password</Label>
					<Input
						className="text-base tracking-[4px]"
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

				{!pending && (
					<>
						{state?.error && <ErrorMessage error={state?.error} />}
						{state?.status === 'success' && <SuccessMessage />}
					</>
				)}

				<Button variant="default" disabled={pending || !passwordIsValid}>
					{pending ? 'Changing...' : 'Change Password'}
				</Button>
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
	const [state, formAction] = useActionState(updatePassword, initialState)
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
		<form className="flex flex-col justify-center w-full" action={formAction}>
			<fieldset disabled={isPending} className="flex flex-col justify-center w-full gap-3">
				<PasswordForm id={id} state={state} />
			</fieldset>
		</form>
	)
}
