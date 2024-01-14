import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'
import FallbackRow from '@/components/icons/Fallback'

const ShowProfile = async () => {
	const userPromise = getUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: user, error }] = await Promise.all([
		userPromise,
		// fakePromise
	])

	if (!user || error) {
		return notFound()
	}

	return (
		<>
			<Avatar name={user.display_name || user?.email} />
			<ProfileForm name={user.display_name} id={user.user_id} />
		</>
	)
}

export default async function Profile() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 opacity-0 animate-in">
			<main className="flex flex-col flex-1 gap-6">
				<h1>Profile</h1>
				<Suspense fallback={<FallbackRow />}>
					<ShowProfile />
				</Suspense>
			</main>
		</div>
	)
}
