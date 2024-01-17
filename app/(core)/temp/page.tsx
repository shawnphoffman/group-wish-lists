import { Suspense } from 'react'

import { getUsers } from '@/app/actions/test'

import Badge from '@/components/common/Badge'
import Fallback from '@/components/common/Fallbacks'
import SuspenseTest from '@/components/utils/SuspenseTest'

// import { getMyLists } from '@/app/actions/lists'

export default async function Temp() {
	const { data: users } = await getUsers()

	// const data = await importAmazonList('https://www.amazon.com/hz/wishlist/ls/2QDX7UX6DZ86O?ref_=wl_share')

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4 opacity-0 animate-in">
			<h1>Temp</h1>

			{/* <pre className="cool-code">
				<code>{JSON.stringify(lists, null, 2)}</code>
			</pre> */}

			<Suspense fallback={<Fallback />}>
				<SuspenseTest />
			</Suspense>
			<Suspense fallback={<Fallback />}>
				<SuspenseTest />
			</Suspense>
			<Suspense fallback={<Fallback />}>
				<SuspenseTest />
			</Suspense>
			<Suspense fallback={<Fallback />}>
				<SuspenseTest />
			</Suspense>

			<h2>Badges</h2>
			<div className="flex flex-col gap-2">
				<Badge className="">Badge</Badge>
				<Badge className="pink">Badge</Badge>
				<Badge className="red">Badge</Badge>
				<Badge className="orange">Badge</Badge>
				<Badge className="yellow">Badge</Badge>
				<Badge className="green">Badge</Badge>
				<Badge className="teal">Badge</Badge>
				<Badge className="blue">Badge</Badge>
				<Badge className="purple">Badge</Badge>
				<Badge className="gray">Badge</Badge>
			</div>

			<h3>Users</h3>
			<Suspense fallback={<Fallback />}>
				<div className="flex flex-row flex-wrap gap-2">
					{users?.map(user => (
						// TODO update badge color logic
						<Badge key={user.id} colorId={user.id}>
							{user.display_name}
						</Badge>
					))}
				</div>
			</Suspense>

			<div className="flex flex-col gap-2">
				<button className="btn">Button</button>
				<button className="btn pink">Button</button>
				<button className="btn red">Button</button>
				<button className="btn orange">Button</button>
				<button className="btn yellow">Button</button>
				<button className="btn green">Button</button>
				<button className="btn teal">Button</button>
				<button className="btn blue">Button</button>
				<button className="btn purple">Button</button>
				<button className="btn gray">Button</button>
			</div>

			<div className="flex flex-col gap-2">
				<button className="nav-btn">Button</button>
				<button className="nav-btn pink">Button</button>
				<button className="nav-btn red">Button</button>
				<button className="nav-btn orange">Button</button>
				<button className="nav-btn yellow">Button</button>
				<button className="nav-btn green">Button</button>
				<button className="nav-btn teal">Button</button>
				<button className="nav-btn blue">Button</button>
				<button className="nav-btn purple">Button</button>
				<button className="nav-btn gray">Button</button>
			</div>
		</div>
	)
}
