import { faFaceThinking } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
	message?: string
}

export default function EmptyMessage({ message = 'Nothing to see here... yet' }: Props) {
	return (
		<Alert className="text-yellow-400 border-yellow-400 dark:text-yellow-500 dark:border-yellow-500">
			<FontAwesomeIcon icon={faFaceThinking} className="text-xl !text-yellow-400 dark:!text-yellow-500" />
			<AlertTitle>Empty List</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
