import Input from '@/components/core/Input'
import Label from '@/components/core/InputLabel'

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
}

export interface OgImage {
	url: string
	type: string
}

export default function ScrapePreview({ scrape }: { scrape: Scrape }) {
	const hasImage = scrape?.result?.ogImage?.length > 0
	return (
		<div className="flex flex-col gap-4 items-stretch border border-dashed border-yellow-400 p-4 w-full">
			<h4>Scrape Preview</h4>
			<div className="flex flex-row gap-4 items-center">
				<Label>Title</Label>
				<Input type="text" readOnly value={scrape.result.ogTitle} />
			</div>
			<div className="flex flex-row gap-4 items-center">
				<Label>URL</Label>
				<Input type="text" readOnly value={scrape.result.ogUrl} />
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
