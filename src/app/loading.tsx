import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-dvh">
			<div className="w-24 text-2xl text-rose-500">
				<FontAwesomeIcon icon="spinner" spin size="lg" />
			</div>
		</div>
	)
}
