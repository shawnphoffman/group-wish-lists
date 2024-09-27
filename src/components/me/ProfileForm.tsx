'use client'

import { useEffect, useTransition } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

import { updateProfile } from '@/app/actions/auth'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

type FormProps = {
	name: string
	id: string
	state: {
		error?: string
		status?: string
	}
}

function ProfileForm({ name, id, state }: FormProps) {
	const { pending } = useFormStatus()
	return (
		<>
			{/* <div className="flex flex-col items-stretch gap-2 xs:items-end xs:flex-row justify-stretch"> */}
			<input type="hidden" name="user_id" value={id} readOnly />
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="name">Name</Label>
				<Input name="name" placeholder="Ezekiel" disabled={pending} defaultValue={name} required />
			</div>
			{/* <button className="btn green" disabled={pending}>
					{pending ? 'Updating...' : 'Update Profile'}
				</button> */}
			{/* </div> */}
			{!pending && (
				<>
					{state?.error && <ErrorMessage error={state?.error} />}
					{state?.status && <SuccessMessage />}
				</>
			)}
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

export default function ProfileFormWrapper({ name, id }: WrapperProps) {
	// @ts-expect-error
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
		<form className="text-foreground" action={formAction}>
			<fieldset className="flex flex-col justify-center w-full gap-3" disabled={isPending}>
				<ProfileForm name={name} id={id} state={state} />
			</fieldset>
		</form>
	)
}
