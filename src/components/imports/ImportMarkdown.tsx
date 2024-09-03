'use client'

import { startTransition, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createMultipleItems } from '@/app/actions/items'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import { List } from '../types'

type Props = {
	listId: List['id']
}

type MarkdownParse = {
	title: string
	notes: string
}

export default function ImportMarkdown({ listId }: Props) {
	const [data, setData] = useState<MarkdownParse[]>([])
	const [rawMarkdown, setRawMarkdown] = useState('')
	const [converting, setConverting] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = useCallback(() => {
		setLoading(true)

		async function importItems() {
			const resp = await createMultipleItems(listId, data)

			if (resp?.status === 'success') {
				startTransition(() => {
					setData([])
					setRawMarkdown('')
					router.refresh()
				})
			}
			setLoading(false)
		}

		importItems()
	}, [data, listId, router])

	const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setRawMarkdown(e.target.value)
	}, [])

	const handleConvert = useCallback(() => {
		setConverting(true)
		async function doStuff() {
			const url = `/api/markdown?raw=${encodeURIComponent(rawMarkdown)}`
			const resp = await fetch(url)

			if (resp) {
				const json: MarkdownParse[] = await resp?.json()
				setData(json)
			}
			setConverting(false)
		}
		doStuff()
	}, [rawMarkdown])

	return (
		<div className="flex flex-col gap-2">
			<label className="label">Paste Notes Here</label>
			<textarea className="textarea" onChange={handleChange} value={rawMarkdown} disabled={loading || converting} />
			<button className="btn blue" type="button" onClick={handleConvert} disabled={loading || converting}>
				{converting ? 'Converting...' : 'Convert Apple Notes'}
			</button>
			{loading ? (
				<FontAwesomeIcon className="self-center text-xl fa-sharp fa-solid fa-spinner-scale fa-spin-pulse fa-fw" />
			) : data.length > 0 ? (
				<div>
					<h4>Conversion Results</h4>
					<div className="pt-4 conversion-wrapper">
						{data.map(token => (
							<div key={token.title} className="conversion">
								<h6>{token.title}</h6>
								<p className="conversion-notes">{token.notes}</p>
							</div>
						))}
					</div>
				</div>
			) : null}
			{data.length > 0 && (
				<button type="button" className="btn green" onClick={handleSubmit} disabled={loading || converting}>
					{loading ? 'Importing...' : 'Import Conversion'}
				</button>
			)}
		</div>
	)
}
