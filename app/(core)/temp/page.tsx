import { Suspense } from 'react'

import Fallback from '@/components/common/Fallbacks'
import SuspenseTest from '@/components/utils/SuspenseTest'

// import { getMyLists } from '@/app/actions/lists'

export default async function Temp() {
	// const { data: lists } = await getMyLists()

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

			{/* <div className="flex flex-col gap-2">
				<button className="btn">Button</button>
				<button className="btn green">Button</button>
				<button className="btn red">Button</button>
				<button className="btn teal">Button</button>
				<button className="btn gray">Button</button>
			</div>

			<div className="flex flex-col gap-2">
				<button className="nav-btn">Button</button>
				<button className="nav-btn green">Button</button>
				<button className="nav-btn red">Button</button>
				<button className="nav-btn teal">Button</button>
				<button className="nav-btn gray">Button</button>
			</div> */}
		</div>
	)
}
