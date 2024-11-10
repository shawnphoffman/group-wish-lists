'use client'

import { faImageSlash } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
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
	const deduped = images
		.map(image => image.url)
		.filter((url, index, self) => {
			if (!url) return false
			if (url?.includes('sprite')) return false
			if (url?.includes('svg+xml')) return false
			if (url?.includes('amazon.com/images/G/')) return false

			return self.indexOf(url) === index
		})
	// .sort()
	return (
		<RadioGroup name="image-url" value={imageUrl} onChange={setImageUrl}>
			<div className="flex flex-row flex-wrap items-center justify-center gap-1">
				{deduped.map(image => {
					// console.log('image', image)
					return (
						<RadioGroup.Option value={image} key={image}>
							{({ checked }) => (
								<ItemImage
									url={image}
									className={`max-h-36 border-4 ${checked ? 'filter-none bg-white border-yellow-500 ' : 'grayscale text-gray-500 border-gray-300 dark:border-gray-700'}`}
								/>
							)}
						</RadioGroup.Option>
					)
				})}
				<RadioGroup.Option value={''}>
					{({ checked }) => (
						<div
							className={`w-32 aspect-square max-h-32 flex items-center justify-center border-4 rounded-lg transition-all ${
								checked ? 'border-red-500 text-red-400' : 'text-white'
							}`}
						>
							<div className="flex flex-col items-center text-4xl">
								<FontAwesomeIcon icon={faImageSlash} className="" />
								<span className="text-xl text-white">No Image</span>
							</div>
						</div>
					)}
				</RadioGroup.Option>
			</div>
		</RadioGroup>
	)
}
