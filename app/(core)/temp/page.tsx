import { Suspense } from 'react'

import { getMyLists } from '@/app/actions/lists'

import SuspenseTest from '@/components/SuspenseTest'
import Fallback from '@/components/icons/Fallback'

export default async function Temp() {
	const { data: lists } = await getMyLists()

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4 opacity-0 animate-in">
			<h1>Temp</h1>

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

			<pre className="cool-code">
				<code>{JSON.stringify(lists, null, 2)}</code>
			</pre>

			<div className="flex flex-col gap-2">
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
			</div>
		</div>
	)
}
