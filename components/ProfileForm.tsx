'use client'

// @ts-expect-error
import { useFormState } from 'react-dom'

import { updateProfile } from '@/app/actions'

import Input from '@/components/core/Input'
import Label from '@/components/core/Label'

const initialState = {
	error: '',
	status: '',
}

export default function ProfileForm({ name }: any) {
	const [state, formAction] = useFormState(updateProfile, initialState)

	return (
		<form className="animate-in flex-1 flex flex-col w-full gap-2 text-foreground" action={formAction}>
			<Label className="text-md" htmlFor="name">
				Name
			</Label>
			<Input name="name" placeholder="Ezekiel" defaultValue={name} required />

			<p aria-live="polite" className="sr-only">
				{state?.error}
			</p>

			<button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 hover:bg-green-800">Update Profile</button>

			{state?.error && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{state.error}</p>}
			{state?.status && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">Updated Successfully</p>}
		</form>
	)
}
