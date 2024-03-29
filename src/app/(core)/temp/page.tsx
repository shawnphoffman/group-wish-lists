import { Suspense } from 'react'

// import { getUsers } from '@/app/actions/test'
import Badge from '@/components/common/Badge'
import EmptyMessage from '@/components/common/EmptyMessage'
import ErrorMessage from '@/components/common/ErrorMessage'
import Fallback, { FallbackRow } from '@/components/common/Fallbacks'
import SuccessMessage from '@/components/common/SuccessMessage'
import ItemCheckbox from '@/components/items/components/ItemCheckbox'
import SuspenseTest from '@/components/utils/SuspenseTest'

// import { getMyLists } from '@/app/actions/lists'

export default async function Temp() {
	// const { data: users } = await getUsers()

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
				<Badge className="gray">Badge</Badge>
				<Badge className="pink">Badge</Badge>
				<Badge className="red">Badge</Badge>
				<Badge className="orange">Badge</Badge>
				<Badge className="yellow">Badge</Badge>
				<Badge className="green">Badge</Badge>
				<Badge className="teal">Badge</Badge>
				<Badge className="blue">Badge</Badge>
				<Badge className="purple">Badge</Badge>
			</div>

			{/* <h3>Users</h3>
			<Suspense fallback={<Fallback />}>
				<div className="flex flex-row flex-wrap gap-2">
					{users?.map(user => (
						// TODO update badge color logic
						<Badge key={user.id} colorId={user.id}>
							{user.display_name}
						</Badge>
					))}
				</div>
			</Suspense> */}

			<hr />

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
				<button className="btn white">Button</button>
				<button className="btn transparent">Button</button>
			</div>

			<hr />

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

			<hr />

			<div className="flex flex-col gap-2">
				<input type="text" value="Wow cool guy" />
				<input type="text" placeholder="Wow cool guy" />
				<input type="password" placeholder="Wow cool guy" />
				<input type="email" placeholder="Wow cool guy" />
				<input type="url" placeholder="Wow cool guy" />
				<input type="radio" checked />
				<input type="radio" />
				<input type="checkbox" checked />
				<input type="checkbox" />
				<ItemCheckbox id="test" isComplete={false} canChange={false} />
				<ItemCheckbox id="test" isComplete={true} canChange={false} />
				<ItemCheckbox id="test" isComplete={false} canChange={false} />
				<ItemCheckbox id="test" isComplete={true} canChange={true} />
			</div>

			<hr />

			<div className="flex flex-col gap-2">
				<select>
					<option>Wow cool guy</option>
					<option>Wow cool guy</option>
					<option>Wow cool guy</option>
				</select>
			</div>

			<hr />

			{/* <pre>
				<code>{JSON.parse("['foo': 'bar']")}</code>
			</pre> */}

			{/* <hr /> */}

			<FallbackRow />

			<hr />

			<div className="border-container">
				<h1>Wow</h1>
				<h1>Wow</h1>
				<h1>Wow</h1>
			</div>

			<hr />

			<div className="list">
				<div className="list-item">Wow</div>
				<div className="list-item">Wow</div>
				<div className="list-item">Wow</div>
				<div className="list-item">Wow</div>
			</div>

			<hr />

			<div className="list">
				<div className="list-item pending">Wow</div>
				<div className="list-item editing">Wow</div>
				<div className="list-item complete">Wow</div>
				<div className="list-item">Wow</div>
			</div>

			<hr />

			<div className="flex flex-col gap-2">
				<SuccessMessage />
				<ErrorMessage />
				<EmptyMessage />
			</div>
		</div>
	)
}
