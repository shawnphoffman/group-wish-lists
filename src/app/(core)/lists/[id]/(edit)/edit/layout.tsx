import { Suspense } from 'react'

import { FallbackRowsMultiple, FallbackRowThick } from '@/components/common/Fallbacks'
import AddItemForm from '@/components/items/forms/AddItemForm'
import { List } from '@/components/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type LayoutProps = {
	params: Promise<{
		id: string
	}>
	children: React.ReactNode
}
export default async function EditLayout({ params, children }: LayoutProps) {
	const resolvedParams = await params
	return (
		// <div className="flex flex-col flex-1 w-full max-w-5xl gap-6 sm:px-2 max-md:gap-2">
		<Suspense fallback={<FallbackRowsMultiple />}>
			{children}

			{/* Add Item */}
			<Card id="add-item" className="animate-page-in bg-accent">
				<CardHeader>
					<CardTitle>Add Item</CardTitle>
					<CardDescription>Enter the information manually or import content from a URL below</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<FallbackRowThick />}>
						<AddItemForm listId={Number(resolvedParams.id)} />
					</Suspense>
				</CardContent>
			</Card>
		</Suspense>
		// </div>
	)
}
