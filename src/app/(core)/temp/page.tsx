import { Suspense } from 'react'

import EmptyMessage from '@/components/common/EmptyMessage'
import ErrorMessage from '@/components/common/ErrorMessage'
import FallbackRow, { FallbackBadge, FallbackButton, FallbackRowsMultiple, FallbackRowThick } from '@/components/common/Fallbacks'
import SuccessMessage from '@/components/common/SuccessMessage'
// import ItemCheckbox from '@/components/items/components/ItemCheckbox'
import ItemRowCheckbox from '@/components/items/components/ItemRowCheckbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SuspenseTest from '@/components/utils/SuspenseTest'
import { ItemStatus } from '@/utils/enums'

// TODO
// - Notifications? Comments?
// - Wish list importer

export default async function Temp() {
	return (
		<div className="flex flex-col flex-1 w-full gap-4 p-4 animate-page-in">
			<h1>Typography</h1>
			<div className="p-4 border rounded">
				<h1>Heading 1</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>
				<h6>Heading 6</h6>
				<p>The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.</p>
			</div>

			<div className="flex flex-col justify-center w-full max-w-xl gap-8 mx-auto">
				<h1>Fallbacks</h1>
				<div className="flex flex-col flex-1 w-full max-w-5xl gap-2 px-4">
					<FallbackRow />
					<Separator />
					<FallbackRowThick />
					<Separator />
					<FallbackRowsMultiple />
					<Separator />
					<FallbackBadge />
					<Separator />
					<FallbackButton />
				</div>
				<h2>Fallback Tests</h2>
				<div className="flex flex-col flex-1 w-full max-w-5xl gap-2 px-4">
					<Suspense fallback={<FallbackRowThick />}>
						<SuspenseTest />
					</Suspense>
					<Suspense fallback={<FallbackRowThick />}>
						<SuspenseTest />
					</Suspense>
					<Suspense fallback={<FallbackRowThick />}>
						<SuspenseTest />
					</Suspense>
					<Suspense fallback={<FallbackRowThick />}>
						<SuspenseTest />
					</Suspense>
				</div>

				<h1>Containers</h1>
				<div className="flex flex-col flex-1 w-full max-w-5xl gap-2 px-4">
					<div className="w-full p-4 border rounded bg-background text-foreground">bg-background text-foreground</div>
					<div className="w-full p-4 border rounded bg-accent text-accent-foreground">bg-accent text-accent-foreground</div>
					<div className="w-full p-4 border rounded bg-primary text-primary-foreground">bg-primary text-primary-foreground</div>
					<div className="w-full p-4 border rounded bg-secondary text-secondary-foreground">bg-secondary text-secondary-foreground</div>
					<div className="w-full p-4 border rounded bg-muted text-muted-foreground">bg-muted text-muted-foreground</div>
					<div className="w-full p-4 border rounded bg-destructive text-destructive-foreground">
						bg-destructive text-destructive-foreground
					</div>
				</div>

				<h1>Badges</h1>
				<div className="flex flex-row flex-1 w-full max-w-5xl gap-2 px-4">
					<Badge variant="default">default</Badge>
					<Badge variant="destructive">destructive</Badge>
					<Badge variant="outline">outline</Badge>
					<Badge variant="secondary">secondary</Badge>
				</div>

				<h1>Forms</h1>
				<Input placeholder="Store Name" />

				{/* <div className="flex flex-col gap-2">
					<ItemCheckbox id="test" isComplete={false} canChange={false} status={ItemStatus.Incomplete} />
					<ItemCheckbox id="test" isComplete={true} canChange={false} status={ItemStatus.Complete} />
					<ItemCheckbox id="test" isComplete={false} canChange={false} status={ItemStatus.Incomplete} />
					<ItemCheckbox id="test" isComplete={true} canChange={true} status={ItemStatus.Complete} />
					<ItemCheckbox id="test" isComplete={false} canChange={false} status={ItemStatus.Unavailable} />
				</div> */}

				<div className="flex flex-col gap-2">
					<ItemRowCheckbox status={ItemStatus.Incomplete} />
					<ItemRowCheckbox status={ItemStatus.Complete} />
					<ItemRowCheckbox status={'complete-locked'} />
					<ItemRowCheckbox status={ItemStatus.Partial} />
					<ItemRowCheckbox status={ItemStatus.Unavailable} />
					<ItemRowCheckbox status={'pending'} />
				</div>

				<hr />

				<h1>Messages</h1>
				<div className="flex flex-col gap-2">
					<SuccessMessage />
					<ErrorMessage />
					<EmptyMessage />
				</div>
			</div>
		</div>
	)
}
