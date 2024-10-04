'use client'

import './ItemImagePicker.css'

import { faXmark } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RadioGroup } from '@headlessui/react'

import ItemImage from '@/components/items/components/ItemImage'
import type { OgImage } from '@/components/types'

type Props = {
	images?: OgImage[]
	imageUrl: string
	setImageUrl: (value: string) => void
}

export default function ItemImagePicker({ images, imageUrl, setImageUrl }: Props) {
	if (!images) return null
	const deduped = images.map(image => image.url).filter((url, index, self) => self.indexOf(url) === index)
	return (
		<RadioGroup name="image-url" value={imageUrl} onChange={setImageUrl}>
			<div className="flex flex-row flex-wrap items-center justify-center gap-4">
				{deduped.map(image => (
					<RadioGroup.Option value={image} key={image}>
						{({ checked }) => (
							<ItemImage
								url={image}
								className={` max-h-48 border-4 no-drag ${checked ? 'filter-none bg-white border-yellow-500 ' : 'grayscale unselected'}`}
							/>
						)}
					</RadioGroup.Option>
				))}
				<RadioGroup.Option value={''}>
					{({ checked }) => (
						<div
							className={`w-48 aspect-square max-h-48 flex items-center justify-center border-4 rounded-lg ${
								checked ? 'border-red-500 text-white' : 'unselected'
							}`}
						>
							<div className="flex flex-col items-center text-4xl">
								<FontAwesomeIcon icon={faXmark} />
								<span className="text-xl">No Image</span>
							</div>
						</div>
					)}
				</RadioGroup.Option>
			</div>
		</RadioGroup>
	)
}