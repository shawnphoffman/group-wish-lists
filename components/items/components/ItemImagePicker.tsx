'use client'

import { RadioGroup } from '@headlessui/react'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ItemImage from '@/components/items/components/ItemImage'

import './ItemImagePicker.css'

const tempImages = [
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

export default function ItemImagePicker({}) {
	return (
		<RadioGroup name="image-url" defaultValue={''}>
			{/* <RadioGroup.Label className="block mb-1 label">List Type</RadioGroup.Label> */}
			<div className="flex flex-row flex-wrap items-center justify-center gap-4">
				{tempImages.map(image => (
					<RadioGroup.Option value={image.url} key={image.url}>
						{({ checked }) => (
							<ItemImage
								url={image.url}
								className={`w-24 h-24 border-4 no-drag ${
									checked ? 'filter-none bg-white border-yellow-500 ' : 'grayscale bg-gray-500 border-gray-700'
								}`}
							/>
						)}
					</RadioGroup.Option>
				))}
				<RadioGroup.Option value={''}>
					{({ checked }) => (
						<div
							className={`w-24 h-24 flex items-center justify-center border-4 rounded-lg ${
								checked ? 'border-red-500 text-white' : 'border-gray-700 text-gray-500'
							}`}
						>
							<div className="text-3xl ">
								<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
							</div>
						</div>
					)}
				</RadioGroup.Option>
			</div>
		</RadioGroup>
	)
}
