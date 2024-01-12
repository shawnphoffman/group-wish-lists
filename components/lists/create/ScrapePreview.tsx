import { Scrape } from '../types'

export const getImageFromScrape = (scrape?: Scrape) => {
	if (scrape?.result?.ogImage?.length && scrape?.result?.ogImage[0]?.url) {
		return scrape.result.ogImage[0].url
	}
	return ''
}

export default function ScrapePreview({ scrape }: { scrape: Scrape }) {
	if (scrape?.error) {
		return (
			<div className="p-4 text-sm text-white bg-red-500 rounded-lg" role="alert">
				<span className="font-bold">Error.</span> {scrape?.result?.error || 'Something went wrong.'}
			</div>
		)
	}
	if (!scrape?.result) {
		return (
			<div className="p-4 text-sm text-white bg-red-500 rounded-lg" role="alert">
				<span className="font-bold">Sorry.</span> No data found for this URL.
			</div>
		)
	}

	const imageUrl = getImageFromScrape(scrape)
	return (
		<div className="flex flex-col items-stretch w-full gap-4 p-4 border border-yellow-400 border-dashed">
			<h4>Scrape Preview</h4>
			<div className="flex flex-row items-center gap-4">
				<label className="label">Title</label>
				<input className="input" type="text" readOnly value={scrape?.result?.ogTitle} />
			</div>
			<div className="flex flex-row items-center gap-4">
				<label className="label">URL</label>
				<input className="input" type="text" readOnly value={scrape?.result?.ogUrl} />
			</div>
			{imageUrl && (
				<div className="flex flex-row gap-4 items-center w-full max-w-[24rem] justify-center self-center">
					<img src={imageUrl} alt={scrape.result.ogTitle} className="object-scale-down rounded-lg" />
				</div>
			)}
		</div>
	)
}
