import { Suspense } from 'react'

import ImportMarkdown from '@/components/ImportMarkdown'
import FallbackRow from '@/components/icons/Fallback'

export default async function Markdown() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4 opacity-0 animate-in">
			<h1>Import Markdown</h1>
			<Suspense fallback={<FallbackRow />}>
				<ImportMarkdown />
			</Suspense>
		</div>
	)
}
