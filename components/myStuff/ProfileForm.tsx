'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
// @ts-expect-error
import { useFormState, useFormStatus } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import ErrorMessage from '../lists/GenericErrorMessage'
import SuccessAlert from '../lists/SuccessAlert'

type FormProps = {
	name: string
	id: string
	state: {
		error: string
		status: string
	}
}

function ProfileForm({ name, id, state }: FormProps) {
	const { pending } = useFormStatus()
	return (
		<>
			<div className="flex flex-col items-stretch gap-2 xs:items-end xs:flex-row justify-stretch">
				<input type="hidden" name="user_id" value={id} readOnly />
				<div className="flex flex-col flex-1">
					<label className="label" htmlFor="name">
						Name
					</label>
					<input className="input" name="name" placeholder="Ezekiel" disabled={pending} defaultValue={name} required />
				</div>
				<button className="btn green" disabled={pending}>
					{pending ? 'Saving...' : 'Save'}
				</button>
			</div>
			{!pending && (
				<>
					{state?.error && <ErrorMessage error={state?.error} />}
					{state?.status && <SuccessAlert />}
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
	const [state, formAction] = useFormState(updateProfile, initialState)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	useEffect(() => {
		if (state?.status === 'success') {
			startTransition(() => {
				router.refresh()
			})
		}
	}, [state])

	return (
		<form className=" text-foreground" action={formAction}>
			<fieldset className="flex flex-col flex-1 w-full gap-2" disabled={isPending}>
				<ProfileForm name={name} id={id} state={state} />
			</fieldset>
		</form>
	)
}
