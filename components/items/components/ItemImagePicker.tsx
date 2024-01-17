'use client'

import { RadioGroup } from '@headlessui/react'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ItemImage from '@/components/items/components/ItemImage'
import { OgImage } from '@/components/types'

import './ItemImagePicker.css'

type Props = {
	images?: OgImage[]
	imageUrl: string
	setImageUrl: (value: string) => void
}

export default function ItemImagePicker({ images, imageUrl, setImageUrl }: Props) {
	console.log('ItemImagePicker', { images, imageUrl })
	if (!images) return null
	return (
		<RadioGroup name="image-url" value={imageUrl} onChange={setImageUrl}>
			{/* <RadioGroup.Label className="block mb-1 label">List Type</RadioGroup.Label> */}
			<div className="flex flex-row flex-wrap items-center justify-center gap-4">
				{images.map(image => (
					<RadioGroup.Option value={image.url} key={image.url}>
						{({ checked }) => (
							<ItemImage
								url={image.url}
								className={` max-h-48 border-4 no-drag ${
									checked ? 'filter-none bg-white border-yellow-500 ' : 'grayscale bg-gray-500 border-gray-700'
								}`}
							/>
						)}
					</RadioGroup.Option>
				))}
				<RadioGroup.Option value={''}>
					{({ checked }) => (
						<div
							className={`w-48 aspect-square max-h-48 flex items-center justify-center border-4 rounded-lg ${
								checked ? 'border-red-500 text-white' : 'border-gray-700 text-gray-500'
							}`}
						>
							<div className="flex flex-col items-center text-4xl">
								<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
								<span className="text-xl">No Image</span>
							</div>
						</div>
					)}
				</RadioGroup.Option>
			</div>
		</RadioGroup>
	)
}
