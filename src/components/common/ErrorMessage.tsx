import { faCircleExclamation } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	error?: string
	includeTitle?: boolean
	className?: string
}

export default function ErrorMessage({ error = 'Something went wrong...', includeTitle = true, className = '' }: Props) {
	return (
		<div
			className={`flex flex-row gap-2 px-3 h-10 py-2 text-base border rounded-lg dark:bg-red-800/10 dark:border-red-900 dark:text-red-500  items-center ${className}`}
			role="alert"
		>
			<FontAwesomeIcon icon={faCircleExclamation} className="text-xl" />
			{includeTitle && <span className="font-bold">Error</span>} {error}
		</div>
	)
}
