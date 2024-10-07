import { Skeleton } from '@/components/ui/skeleton'

export const FallbackRow = () => (
	<div className="space-y-2">
		<Skeleton className="w-full h-3" />
		<Skeleton className="w-4/5 h-3" />
		<Skeleton className="w-full h-3" />
	</div>
)

export const FallbackRowThick = () => <Skeleton className="w-full h-16" />

export default FallbackRow
