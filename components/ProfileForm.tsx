'use client'

// @ts-expect-error
import { useFormState, useFormStatus } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import ErrorMessage from './lists/GenericErrorMessage'
import SuccessAlert from './lists/SuccessAlert'

type FormProps = {
	name: string
	id: string
	state: {
		error: string
		status: string
	}
}

function ProfileForm({ name, id, state }: FormProps) {
	// const { pending, data, method, action } = useFormStatus()
	const { pending } = useFormStatus()
	return (
		<>
			<input type="hidden" name="user_id" value={id} readOnly />
			<label className="label" htmlFor="name">
				Name
			</label>
			<input className="input" name="name" placeholder="Ezekiel" disabled={pending} defaultValue={name} required />
			<button className="btn green" disabled={pending}>
				{pending ? 'Updating...' : 'Update Profile'}
			</button>
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
	return (
		<form className="flex flex-col flex-1 w-full gap-2 text-foreground" action={formAction}>
			<ProfileForm name={name} id={id} state={state} />
		</form>
	)
}
