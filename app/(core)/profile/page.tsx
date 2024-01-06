import UserCode from '@/components/UserCode'
import ProfileForm from '@/components/ProfileForm'
import { getUser } from '@/app/actions'

export default async function Profile() {
	const { data } = await getUser()

	return (
		<div className="animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<main className="flex-1 flex flex-col gap-6">
				<h1>Profile</h1>

				<ProfileForm name={data?.user?.user_metadata?.name} />

				<UserCode user={data} />
			</main>
		</div>
	)
}
