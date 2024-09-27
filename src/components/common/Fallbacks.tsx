import { Skeleton } from '@/components/ui/skeleton'

export const FallbackRow = ({ label }: { label?: string }) => {
	return (
		<div className="space-y-2">
			<Skeleton className="w-full h-3" />
			<Skeleton className="w-4/5 h-3" />
			<Skeleton className="w-full h-3" />
		</div>
		// <div className="fallback">
		// 	<div className="list-item" />
		// 	<div className="list-item">{label}</div>
		// 	<div className="list-item" />
		// </div>
	)
}

export default FallbackRow
