'use client'

// @ts-expect-error
import { useFormState } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

import Input from '@/components/core/Input'
import Label from '@/components/core/Label'

const initialState = {
	error: '',
	status: '',
}

export default function ProfileForm({ name }: any) {
	const [state, formAction] = useFormState(updateProfile, initialState)

	return (
		<form className="flex-1 flex flex-col w-full gap-2 text-foreground" action={formAction}>
			<Label htmlFor="name">Name</Label>
			<Input name="name" placeholder="Ezekiel" defaultValue={name} required />

			<p aria-live="polite" className="sr-only">
				{state?.error}
			</p>

			<button className="w-full py-3 px-4 justify-center inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
				Update Profile
			</button>

			{state?.error && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{state.error}</p>}
			{state?.status && (
				<div className="bg-green-50 border-t-2 border-green-500 rounded-lg p-4 dark:bg-green-800/30" role="alert">
					<div className="flex">
						<div className="flex-shrink-0">
							<span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-green-100 bg-green-200 text-green-800 dark:border-green-900 dark:bg-green-800 dark:text-green-400">
								<svg
									className="flex-shrink-0 w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
									<path d="m9 12 2 2 4-4" />
								</svg>
							</span>
						</div>
						<div className="ms-3 flex items-center">
							<h3 className="text-gray-800 font-semibold dark:text-white">Successfully updated.</h3>
							{/* <p className="text-sm text-gray-700 dark:text-gray-400">You have successfully updated your email preferences.</p> */}
						</div>
					</div>
				</div>
			)}
		</form>
	)
}
