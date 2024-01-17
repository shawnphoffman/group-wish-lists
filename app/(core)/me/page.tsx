import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getUser } from '@/app/actions/auth'

import Badge from '@/components/common/Badge'
import FallbackRow from '@/components/common/Fallbacks'
import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import MyLists from '@/components/me/MyLists'
import ProfileForm from '@/components/me/ProfileForm'

const CreateListModal = dynamic(() => import('@/components/me/CreateListModal'), { ssr: false })

const MyStuffClient = async () => {
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
		<div className="flex flex-col gap-3">
			<div className="flex flex-row items-center justify-between">
				<h1>Profile</h1>
				<Badge colorId={user.id} className="!text-base">
					{user.display_name}
				</Badge>
			</div>
			<ProfileForm name={user.display_name} id={user.user_id} />
		</div>
	)
}

export default async function MyStuff() {
	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-xl px-3 opacity-0 animate-in">
				<main className="flex flex-col flex-1 gap-8">
					{/* LISTS */}
					<div className="flex flex-col gap-3">
						{/* Header */}
						<div className="flex flex-row justify-between">
							<h1>My Lists</h1>
							<button type="button" className="mt-0 nav-btn blue" data-hs-overlay="#hs-create-list-modal">
								<FontAwesomeIcon className="fa-sharp fa-solid fa-plus" />
								Create List
							</button>
						</div>
						{/* Lists */}
						<Suspense fallback={<FallbackRow />}>
							<MyLists />
						</Suspense>
					</div>

					<Suspense fallback={null}>
						<MyStuffClient />
					</Suspense>
				</main>
			</div>
			<CreateListModal />
		</>
	)
}
