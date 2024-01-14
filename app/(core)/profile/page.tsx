import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
	const { data: user, error } = await getUser()

	if (!user || error) {
		return notFound()
	}

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 opacity-0 animate-in">
			<main className="flex flex-col flex-1 gap-6">
				<h1>Profile</h1>
				<Avatar name={user.display_name || user?.email} />
				<ProfileForm name={user.display_name} id={user.user_id} />
			</main>
		</div>
	)
}
