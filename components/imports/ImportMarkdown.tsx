'use client'

import { useCallback, useState } from 'react'

type MarkdownParse = {
	title: string
	description: string
}

export default function ImportMarkdown() {
	const [data, setData] = useState<MarkdownParse[]>([])
	const [rawMarkdown, setRawMarkdown] = useState('')

	const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setRawMarkdown(e.target.value)
	}, [])

	const handleClick = useCallback(() => {
		async function doStuff() {
			const url = `/api/markdown?raw=${encodeURIComponent(rawMarkdown)}`
			const resp = await fetch(url)

			if (resp) {
				const json: MarkdownParse[] = await resp?.json()
				setData(json)
			}
		}
		doStuff()
	}, [rawMarkdown])

	return (
		<div className="flex flex-col gap-2">
			<textarea className="textarea" onChange={handleChange} value={rawMarkdown} />
			<button className="btn green" type="button" onClick={handleClick}>
				Import Markdown
			</button>
			{data.map(token => (
				<div key={token.title}>
					<h6>{token.title}</h6>
					<p
						style={{
							whiteSpace: 'wrap',
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							color: 'gray',
							fontSize: '0.85rem',
							paddingLeft: '1rem',
						}}
					>
						{token.description}
					</p>
				</div>
			))}
			{/* <pre className="cool-code">
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre> */}
		</div>
	)
}
