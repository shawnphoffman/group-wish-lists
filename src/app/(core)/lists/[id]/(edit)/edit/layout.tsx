import { Suspense } from 'react'

import { FallbackRowsMultiple, FallbackRowThick } from '@/components/common/Fallbacks'
import AddItemForm from '@/components/items/forms/AddItemForm'
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
		<Suspense fallback={<FallbackRowsMultiple />}>
			{children}
			{/* Add Item */}
			<Card id="add-item" className="animate-page-in-delayed bg-accent">
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
	)
}
