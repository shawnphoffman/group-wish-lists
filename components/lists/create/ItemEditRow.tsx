import ItemPriorityIcon from '../ItemPriorityIcon'

export default function ListItemEditRow({ item }: any) {
	if (!item) return null

	const hasImage = item.scrape?.result?.ogImage?.length > 0

	return (
		<div className="flex flex-row items-stretch gap-x-3.5 gap-y-4 py-3 px-4 text-lg font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
			<div className="flex flex-col items-center justify-center w-4 shrink-0">
				<ItemPriorityIcon priority={item.priority} />
			</div>
			<div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center">
				<div className="flex-1">{item.title}</div>
				{/* <img src={scrape.result.ogImage[0].url} alt={scrape.result.ogTitle} className="w-56 h-auto" /> */}
				{hasImage && (
					<img src={item.scrape.result.ogImage[0].url} alt={item.scrape.result.ogTitle} className="object-scale-down rounded-lg w-24" />
				)}
				{/* <div className="flex flex-col gap-4 justify-center"> */}
				<div className="flex flex-row gap-4 items-center justify-end text-xl">
					<button type="button" className="text-yellow-200 hover:text-yellow-300">
						<i className="fa-sharp fa-solid fa-pen-to-square" aria-hidden />
					</button>
					<button type="button" className="text-red-300 hover:text-red-400">
						<i className="fa-sharp fa-solid fa-trash-xmark" aria-hidden />
					</button>
					{/* </div> */}
				</div>
			</div>
		</div>
	)
}
