import { faCircleCheck, faCircleExclamation } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

type Props = {
	error?: string
	includeTitle?: boolean
	className?: string
}

export default function ErrorMessage({ error = 'Something went wrong...', includeTitle = true, className = '' }: Props) {
	return (
		<Alert variant={'destructive'}>
			<FontAwesomeIcon icon={faCircleExclamation} className="text-xl" />
			{includeTitle && <AlertTitle>Error</AlertTitle>}
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	)
}
