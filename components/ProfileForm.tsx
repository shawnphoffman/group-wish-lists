'use client'

// @ts-expect-error
import { useFormStatus } from 'react-dom'

import ErrorMessage from './lists/GenericErrorMessage'
import SuccessAlert from './lists/SuccessAlert'

type Props = {
	name: string
	id: string
	state: {
		error: string
		status: string
	}
}

export default function ProfileForm({ name, id, state }: Props) {
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
