import './ErrorMessage.css'

import { faCircleExclamation } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	error?: string
	includeTitle?: boolean
	className?: string
}

export default function ErrorMessage({ error = 'Something went wrong...', includeTitle = true, className = '' }: Props) {
	return (
		<div className={`error ${className}`} role="alert">
			<FontAwesomeIcon icon={faCircleExclamation} className="text-2xl" />
			{includeTitle && <span className="font-bold">Error</span>} {error}
		</div>
	)
}
