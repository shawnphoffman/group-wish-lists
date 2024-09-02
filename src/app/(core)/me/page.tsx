import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'
import { getSessionUser } from '@/app/actions/auth'
import Badge from '@/components/common/Badge'
import FallbackRow from '@/components/common/Fallbacks'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import CreateListModal from '@/components/me/CreateListModal'
import LinkToAppleButton from '@/components/me/LinkToAppleButton'
import MyLists from '@/components/me/MyLists'
import MyPurchases from '@/components/me/MyPurchases'
import PasswordForm from '@/components/me/PasswordForm'
import ProfileForm from '@/components/me/ProfileForm'

type Props = {
	searchParams: Record<string, string> | null | undefined
}

const MyStuffClient = async () => {
	const userPromise = getUser()
	const sessionPromise = getSessionUser()
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))

	const [{ data: user, error }, sessionUser] = await Promise.all([
		userPromise,
		sessionPromise,
		// fakePromise
	])

	if (!user || error) {
		return notFound()
	}

	const hasAppleLinked = sessionUser?.identities?.some(i => i.provider === 'apple') || false

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
			{!hasAppleLinked && (
				<div className="flex flex-col gap-3">
					<h2>Account Linking</h2>
					<LinkToAppleButton />
				</div>
			)}
		</div>
	)
}

export default async function MyStuff({ searchParams }: Props) {
	const show = searchParams?.show
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-2xl px-3 opacity-0 animate-in">
				<main className="flex flex-col flex-1 gap-8 divide-y">
					{/* LISTS */}
					<div className="flex flex-col gap-3">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Lists</h1>

							<Link href="/me?show=true" className="mt-0 nav-btn blue">
								<FontAwesomeIcon className="fa-sharp fa-solid fa-plus" />
								Create List
							</Link>
						</div>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyLists />
						</Suspense>
						<h3>Shared with Me</h3>
						<Suspense fallback={<FallbackRow />}>
							<MyLists type="shared_with_me" />
						</Suspense>
						<h3>Shared with Others</h3>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyLists type="shared_with_others" />
						</Suspense>
					</div>

					<Suspense fallback={null}>
						<MyStuffClient />
					</Suspense>

					{/* LISTS */}
					<div className="flex flex-col gap-3 pt-6">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Purchases</h1>
						</div>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyPurchases />
						</Suspense>
					</div>
				</main>
			</div>
			{show && <CreateListModal />}
		</>
	)
}
