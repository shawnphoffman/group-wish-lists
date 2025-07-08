'use client'

import { useActionState, useCallback, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'
import ErrorMessage from '@/components/common/ErrorMessage'
import SuccessMessage from '@/components/common/SuccessMessage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FormProps = {
	name: string
	id: string
	state: {
		error?: string
		status?: string
	}
	birthMonth: string
	birthDay: string
}

function ProfileForm({ name, id, state, birthMonth, birthDay }: FormProps) {
	const { pending } = useFormStatus()
	const [selectedMonth, setSelectedMonth] = useState<string>(birthMonth)

	const handleChangeMonth = useCallback(value => {
		setSelectedMonth(value)
	}, [])

	console.log('ProfileForm', { name, id, state, pending, birthMonth, birthDay, selectedMonth })

	return (
		<>
			<input type="hidden" name="user_id" value={id} readOnly />

			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="name">Name</Label>
				<Input name="name" placeholder="Ezekiel" disabled={pending} defaultValue={name} required />
			</div>

			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label>Birthday</Label>
				<div className="flex flex-row gap-1">
					<label className="sr-only" htmlFor="birth_month">
						Birth Month
					</label>
					<Select name="birth_month" value={selectedMonth} onValueChange={handleChangeMonth}>
						<SelectTrigger>
							<SelectValue placeholder="Select a month" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="january">January</SelectItem>
							<SelectItem value="february">February</SelectItem>
							<SelectItem value="march">March</SelectItem>
							<SelectItem value="april">April</SelectItem>
							<SelectItem value="may">May</SelectItem>
							<SelectItem value="june">June</SelectItem>
							<SelectItem value="july">July</SelectItem>
							<SelectItem value="august">August</SelectItem>
							<SelectItem value="september">September</SelectItem>
							<SelectItem value="october">October</SelectItem>
							<SelectItem value="november">November</SelectItem>
							<SelectItem value="december">December</SelectItem>
						</SelectContent>
					</Select>
					<label className="sr-only" htmlFor="birth_day">
						Birth Day
					</label>
					<Input name="birth_day" type="number" max={'31'} min="1" defaultValue={birthDay} disabled={pending} />
				</div>
			</div>

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
	birthMonth: string
	birthDay: string
}

const initialState = {
	error: '',
	status: '',
}

export default function ProfileFormWrapper({ name, id, birthMonth, birthDay }: WrapperProps) {
	const [state, formAction] = useActionState(updateProfile, initialState)
	const [isPending] = useTransition()

	return (
		<form className="w-full text-foreground" action={formAction} id="update-profile-form">
			<fieldset className="flex flex-col justify-center w-full gap-3" disabled={isPending}>
				<ProfileForm name={name} id={id} state={state} birthMonth={birthMonth} birthDay={birthDay} />
			</fieldset>
		</form>
	)
}
