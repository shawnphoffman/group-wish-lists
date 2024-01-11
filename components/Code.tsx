'use client'

import { useState } from 'react'

import CheckIcon from './icons/CheckIcon'
import CopyIcon from './icons/CopyIcon'

export default function Code({ code }: { code: string }) {
	const [icon, setIcon] = useState(CopyIcon)

	const copy = async () => {
		await navigator?.clipboard?.writeText(code)
		setIcon(CheckIcon)
		setTimeout(() => setIcon(CopyIcon), 2000)
	}

	return (
		<pre className="relative p-4 my-0 overflow-scroll text-xs text-green-300 rounded-md bg-foreground/5">
			<button onClick={copy} className="absolute p-2 rounded-md top-4 right-4 bg-foreground/5 hover:bg-foreground/10">
				{icon}
			</button>
			<code>{code}</code>
		</pre>
	)
}
