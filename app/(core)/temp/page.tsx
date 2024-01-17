// import { Suspense } from 'react'
import ItemImage from '@/components/items/components/ItemImage'
import ItemImagePicker from '@/components/items/components/ItemImagePicker'

// import { getMyLists } from '@/app/actions/lists'
// import SuspenseTest from '@/components/SuspenseTest'
// import Fallback from '@/components/icons/Fallback'

const images = [
	{
		url: 'https://bombas.com/cdn/shop/products/7069-oceanfog-adult-male-2-transparent_1024x1024.png?v=1704376885',
		type: 'png',
	},
	{
		url: 'https://bombas.com/cdn/shop/products/7069-oceanfog-adult-detail-5-transparent_3df92a41-4e30-4045-8277-b1a0cd0b9cfd_1024x1024.png?v=1704376885',
		type: 'png',
	},
	{
		url: 'https://bombas.com/cdn/shop/products/7069-oceanfog-adult-male-3-transparent_1024x1024.png?v=1704376885',
		type: 'png',
	},
]

export default async function Temp() {
	// const { data: lists } = await getMyLists()

	// const data = await importAmazonList('https://www.amazon.com/hz/wishlist/ls/2QDX7UX6DZ86O?ref_=wl_share')

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4 opacity-0 animate-in">
			<h1>Temp</h1>

			<ItemImagePicker />

			<hr />

			{images.map((image, i) => (
				<ItemImage key={i} url={image.url} className="" />
			))}

			{/* <pre className="cool-code">
				<code>{JSON.stringify(lists, null, 2)}</code>
			</pre> */}

			{/* <Suspense fallback={<Fallback />}>
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
			</Suspense> */}

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
