import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import './SuccessMessage.css'

type Props = {
	message?: string
}

export default function SuccessMessage({ message = 'Successfully updated.' }: Props) {
	return (
		<div className="success">
			<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-circle-check" />
			<div>{message}</div>
		</div>
	)
}

// export default function SuccessMessage({ message = 'Successfully updated.' }: { message?: string }) {
// 	return (
// 		<div className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/30" role="alert">
// 			<div className="flex">
// 				<div className="flex-shrink-0">
// 					<span className="inline-flex items-center justify-center w-8 h-8 text-green-800 bg-green-200 border-4 border-green-100 rounded-full dark:border-green-900 dark:bg-green-800 dark:text-green-200">
// 						<FontAwesomeIcon className="text-2xl fa-sharp fa-solid fa-circle-check" />
// 					</span>
// 				</div>
// 				<div className="flex items-center text-base font-semibold text-gray-800 ms-3 dark:text-white">{message}</div>
// 			</div>
// 		</div>
// 	)
// }
