import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
	const { data } = await getUser()

	const name = data?.user?.user_metadata?.name

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 opacity-0 animate-in">
			<main className="flex flex-col flex-1 gap-6">
				<h1>Profile</h1>
				<Avatar name={name || data?.user?.email} />
				{/*
					<Avatar name={'Shawn'} />
					<Avatar name={'Melissa'} />
					<Avatar name={'Jason'} />
					<Avatar name={'Graham'} />
					<Avatar name={'Chase'} />
					<Avatar name={'Sam'} />
					<Avatar name={'Carol'} />
					<Avatar name={'Jeff'} />
					<Avatar name={'Kate'} />
				*/}
				<ProfileForm name={name} />
			</main>
		</div>
	)
}
