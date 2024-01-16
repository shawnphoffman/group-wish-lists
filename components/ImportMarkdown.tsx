'use client'

import { useCallback, useState } from 'react'

export default function ImportMarkdown() {
	const [data, setData] = useState({})
	const [rawMarkdown, setRawMarkdown] = useState('')

	const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setRawMarkdown(e.target.value)
	}, [])

	const handleClick = useCallback(() => {
		async function doStuff() {
			console.log('click')
			const url = `/api/markdown?raw=${encodeURIComponent(rawMarkdown)}`
			const resp = await fetch(url)

			if (resp) {
				console.log('resp', resp)
				const json = await resp?.json()

				const clean = json.reduce((acc, curr) => {
					if (curr.content === '') return acc

					const cleanCurr = {
						...curr,
					}
					delete cleanCurr.children
					delete cleanCurr.map

					acc.push(cleanCurr)

					return acc
				}, [])

				setData(clean)
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
			<pre className="cool-code">
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		</div>
	)
}
