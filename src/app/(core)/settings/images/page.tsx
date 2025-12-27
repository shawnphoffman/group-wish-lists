import { Suspense } from 'react'
import { faImage } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImagesList from '@/components/images/ImagesList'

export default async function Page() {
	return (
		<div className="grid gap-6 animate-page-in">
			<Card className="bg-accent">
				<CardHeader>
					<CardTitle>
						<FontAwesomeIcon size="sm" icon={faImage} className="mr-1" />
						My Images
					</CardTitle>
				</CardHeader>
				<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
					<Suspense fallback={<FallbackRowThick />}>
						<ImagesList />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}
