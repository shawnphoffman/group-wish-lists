import { faFaceThinking } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {}

export default function EmptyListMessage({}: Props) {
	return (
		<div className="flex flex-row items-center gap-2 p-2 py-2.5">
			<FontAwesomeIcon icon={faFaceThinking} className="text-xl !text-yellow-400 dark:!text-yellow-500" />
			<div className="text-sm italic text-muted-foreground">No lists to display...</div>
		</div>
	)
}
