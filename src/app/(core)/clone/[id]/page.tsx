import { Suspense } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import ClientWrapper from './ClientWrapper'

type Props = {
	params: Promise<{
		id: string
	}>
}

export default async function CloneItem({ params }: Props) {
	const { id } = await params
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl gap-6 sm:px-3 max-md:gap-2 animate-page-in">
			<Card className="bg-accent">
				<CardHeader>
					<CardTitle>Clone Item</CardTitle>
					<CardDescription>Copy this item to one of your own lists. The item details should be prepopulated below.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Suspense>
						<ClientWrapper itemId={id} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
