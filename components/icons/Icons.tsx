import FontAwesomeIcon from './FontAwesomeIcon'

export const FallbackIcon = () => <FontAwesomeIcon className="text-3xl text-white fa-sharp fa-fw fa-solid fa-compact-disc fa-spin" />

export function OpenImageIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-yellow-500 hover:text-yellow-400' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-image`} />
}
export function OpenUrlIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-teal-300 hover:text-teal-400' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-up-right-from-square`} />
}
export function EditIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-yellow-200 hover:text-yellow-300' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-pen-to-square`} />
}
export function DeleteIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-red-400 hover:text-red-300' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-trash-xmark`} />
}
export function UnarchiveIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-teal-400 hover:text-teal-300' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-eye`} />
}
export function ArchiveIcon({ includeColor = true }) {
	const colorClasses = includeColor ? 'text-yellow-400 hover:text-yellow-300' : ''
	return <FontAwesomeIcon className={`${colorClasses} fa-sharp fa-fw fa-solid fa-eye-slash`} />
}
