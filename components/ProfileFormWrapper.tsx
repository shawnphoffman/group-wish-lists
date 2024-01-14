'use client'

// @ts-expect-error
import { useFormState } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import ProfileForm from '@/components/ProfileForm'

const initialState = {
	error: '',
	status: '',
}

type Props = {
	name: string
	id: string
}

export default function ProfileFormWrapper({ name, id }: Props) {
	const [state, formAction] = useFormState(updateProfile, initialState)
	return (
		<form className="flex flex-col flex-1 w-full gap-2 text-foreground" action={formAction}>
			<ProfileForm name={name} id={id} state={state} />
		</form>
	)
}
