import { getUser } from '@/app/actions/auth'
import { getMyLists } from '@/app/actions/lists'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
	const { data: lists } = await getMyLists()
	const { data: userData } = await getUser()

	console.log('lists', lists)

	const name = userData?.user?.user_metadata?.name

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg px-3 opacity-0 animate-in">
			<main className="flex flex-col flex-1 gap-6">
				<h1>Profile</h1>
				<Avatar name={name || userData?.user?.email} />
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
				<pre className="cool-code">
					<code>{JSON.stringify(lists, null, 2)}</code>
				</pre>
			</main>
		</div>
	)
}
