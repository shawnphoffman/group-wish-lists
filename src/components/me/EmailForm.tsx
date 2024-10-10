'use client'

import { useTransition } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { updateEmail } from '@/app/actions/auth'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormProps = {
	email?: string
	state: {
		error?: string
		status?: string
	}
}

function EmailForm({ email, state }: FormProps) {
	const { pending, data } = useFormStatus()

	console.log('EmailForm', { email, state, pending, data })

	return (
		<>
			<div className="grid w-full max-w-md items-center gap-1.5">
				<Label htmlFor="email">Email</Label>
				<div className="flex flex-row gap-1">
					<Input name="email" defaultValue={email} disabled={pending} required />
					<Button disabled={pending}>Update</Button>
				</div>
			</div>
			{state?.error && <ErrorMessage error={state?.error} />}
			{state?.status && <SuccessMessage />}
		</>
	)
}

type WrapperProps = {
	email?: string
}

const initialState = {
	error: '',
	status: '',
}

export default function EmailFormWrapper({ email }: WrapperProps) {
	const [state, formAction] = useFormState(updateEmail, initialState)
	const [isPending] = useTransition()

	console.log('EmailFormWrapper', { email, state, isPending })

	return (
		<form className="text-foreground" action={formAction}>
			<fieldset className="flex flex-col justify-center w-full gap-3" disabled={isPending}>
				<EmailForm state={state} email={email} />
			</fieldset>
		</form>
	)
}
