import FontAwesomeIcon from './FontAwesomeIcon'

export const FallbackIcon = () => <FontAwesomeIcon className="text-3xl text-white fa-sharp fa-solid fa-compact-disc fa-spin" />

export function OpenUrlIcon() {
	return <FontAwesomeIcon className="text-teal-300 fa-sharp fa-solid fa-up-right-from-square hover:text-teal-400" />
}
export function EditIcon() {
	return <FontAwesomeIcon className="text-yellow-200 fa-sharp fa-solid fa-pen-to-square hover:text-yellow-300" />
}
export function DeleteIcon() {
	return <FontAwesomeIcon className="text-red-300 fa-sharp fa-solid fa-trash-xmark hover:text-red-400" />
}
export function UnarchiveIcon() {
	return <FontAwesomeIcon className="text-teal-300 fa-sharp fa-solid fa-eye hover:text-teal-400" />
}
