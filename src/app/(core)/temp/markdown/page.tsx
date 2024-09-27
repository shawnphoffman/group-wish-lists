import { Suspense } from 'react'

import FallbackRow from '@/components/common/Fallbacks'
import ImportMarkdown from '@/components/imports/ImportMarkdown'

export default async function Markdown() {
	return (
		<div className="flex flex-col flex-1 w-full max-w-2xl gap-4 p-4 ">
			<h1>Import Markdown</h1>
			<Suspense fallback={<FallbackRow />}>
				<ImportMarkdown listId={0} />
			</Suspense>
		</div>
	)
}
