// import Code from '@/components/Code'

export interface Scrape {
	error: boolean
	result: Result
}

export interface Result {
	ogUrl: string
	ogTitle: string
	ogDescription: string
	ogImage: OgImage[]
	ogLocale: string
	charset: string
	requestUrl: string
	success: boolean
	error: string
}

export interface OgImage {
	url: string
	type: string
}

export default function ScrapePreview({ scrape }: { scrape: Scrape }) {
	if (scrape?.error) {
		return (
			<div className="bg-red-500 text-sm text-white rounded-lg p-4" role="alert">
				<span className="font-bold">Error.</span> {scrape?.result?.error || 'Something went wrong.'}
			</div>
		)
	}
	if (!scrape?.result) {
		return (
			<div className="bg-red-500 text-sm text-white rounded-lg p-4" role="alert">
				<span className="font-bold">Sorry.</span> No data found for this URL.
			</div>
		)
	}

	return null

	const hasImage = scrape?.result?.ogImage?.length > 0
	return (
		<div className="flex flex-col gap-4 items-stretch border border-dashed border-yellow-400 p-4 w-full">
			<h4>Scrape Preview</h4>
			<div className="flex flex-row gap-4 items-center">
				<label className="label">Title</label>
				<input className="input" type="text" readOnly value={scrape?.result?.ogTitle} />
			</div>
			<div className="flex flex-row gap-4 items-center">
				<label className="label">URL</label>
				<input className="input" type="text" readOnly value={scrape?.result?.ogUrl} />
			</div>
			{hasImage && (
				<div className="flex flex-row gap-4 items-center w-full max-w-[24rem] justify-center self-center">
					{/* <img src={scrape.result.ogImage[0].url} alt={scrape.result.ogTitle} className="w-56 h-auto" /> */}
					<img src={scrape.result.ogImage[0].url} alt={scrape.result.ogTitle} className="object-scale-down rounded-lg" />
				</div>
			)}
		</div>
	)
}
