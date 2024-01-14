'use client'

// @ts-expect-error
import { useFormState } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import FontAwesomeIcon from './icons/FontAwesomeIcon'
import ErrorMessage from './lists/GenericErrorMessage'
import SuccessAlert from './lists/SuccessAlert'

const initialState = {
	error: '',
	status: '',
}

type Props = {
	name: string
	id: string
}

export default function ProfileForm({ name, id }: Props) {
	const [state, formAction] = useFormState(updateProfile, initialState)

	return (
		<form className="flex flex-col flex-1 w-full gap-2 text-foreground" action={formAction}>
			<input type="hidden" name="user_id" value={id} readOnly />
			<label className="label" htmlFor="name">
				Name
			</label>
			<input className="input" name="name" placeholder="Ezekiel" defaultValue={name} required />

			<p aria-live="polite" className="sr-only">
				{state?.error}
			</p>

			<button className="btn green">Update Profile</button>

			{state?.error && <ErrorMessage error={state?.error} />}
			{state?.status && <SuccessAlert />}
		</form>
	)
}
