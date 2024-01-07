import { getUser } from '@/app/actions/auth'

import ProfileForm from '@/components/ProfileForm'
import UserCode from '@/components/UserCode'
import Avatar from '@/components/core/Avatar'

import { isDeployed } from '@/utils/environment'

export default async function Profile() {
	const { data } = await getUser()

	const name = data?.user?.user_metadata?.name

	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<main className="flex-1 flex flex-col gap-6">
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

				{!isDeployed && <UserCode user={data} />}
			</main>
		</div>
	)
}
