import { faFaceThinking } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
	message?: string
}

export default function EmptyMessage({ message = 'Nothing to see here... yet' }: Props) {
	return (
		<Alert className="text-yellow-500 border-yellow-500">
			<FontAwesomeIcon icon={faFaceThinking} className="text-xl !text-yellow-500" />
			<AlertTitle>Empty List</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
