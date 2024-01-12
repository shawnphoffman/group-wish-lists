'use client'

// @ts-expect-error
import { useFormState } from 'react-dom'

import { updateProfile } from '@/app/actions/auth'

const initialState = {
	error: '',
	status: '',
}

export default function ProfileForm({ name }: any) {
	const [state, formAction] = useFormState(updateProfile, initialState)

	return (
		<form className="flex flex-col flex-1 w-full gap-2 text-foreground" action={formAction}>
			<label className="label" htmlFor="name">
				Name
			</label>
			<input className="input" name="name" placeholder="Ezekiel" defaultValue={name} required />

			<p aria-live="polite" className="sr-only">
				{state?.error}
			</p>

			<button className="btn green">Update Profile</button>

			{state?.error && <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">{state.error}</p>}
			{state?.status && (
				<div className="p-4 border-t-2 border-green-500 rounded-lg bg-green-50 dark:bg-green-800/30" role="alert">
					<div className="flex">
						<div className="flex-shrink-0">
							<span className="inline-flex items-center justify-center w-8 h-8 text-green-800 bg-green-200 border-4 border-green-100 rounded-full dark:border-green-900 dark:bg-green-800 dark:text-green-400">
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
						<div className="flex items-center ms-3">
							<h3 className="font-semibold text-gray-800 dark:text-white">Successfully updated.</h3>
							{/* <p className="text-sm text-gray-700 dark:text-gray-400">You have successfully updated your email preferences.</p> */}
						</div>
					</div>
				</div>
			)}
		</form>
	)
}
