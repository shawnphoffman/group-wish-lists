import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import Badge from '@/components/common/Badge'
import PasswordForm from '@/components/me/PasswordForm'
import ProfileForm from '@/components/me/ProfileForm'
// import LinkToAppleButton from '@/components/me/LinkToAppleButton'

export default async function MeClient() {
	const userPromise = getUser()
	// const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: user, error }] = await Promise.all([
		// const [{ data: user, error }, sessionUser] = await Promise.all([
		userPromise,
		// sessionPromise,
		// fakePromise
	])
	console.log('MyStuffClient', { user })

	// if (!user || error) {
	if (error) {
		console.log('MyStuffClient.error', { user, error })
		return notFound()
	}

	// const hasAppleLinked = sessionUser?.identities?.some(i => i.provider === 'apple') || false

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-3 pt-6">
				<div className="flex flex-row items-center justify-between">
					<h1>Profile</h1>
					<Badge colorId={user.id} className="!text-base">
						{user.display_name}
					</Badge>
				</div>
				<ProfileForm name={user.display_name} id={user.user_id} />
			</div>
			<div className="flex flex-col gap-3">
				<h2>Passwords</h2>
				<PasswordForm id={user.user_id} />
			</div>
			{/* {!hasAppleLinked && (
				<div className="flex flex-col gap-3">
					<h2>Account Linking</h2>
					<LinkToAppleButton />
				</div>
			)} */}
		</div>
	)
}
