import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
	const { data: userData } = await getUser()
	const name = userData?.user?.user_metadata?.name

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 opacity-0 animate-in">
			<main className="flex flex-col flex-1 gap-6">
				<h1>Profile</h1>
				<Avatar name={name || userData?.user?.email} />
				<ProfileForm name={name} />
			</main>
		</div>
	)
}
