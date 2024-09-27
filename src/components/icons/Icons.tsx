import { faEye, faEyeSlash, faPenToSquare, faTrashXmark, faUpRightFromSquare } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function OpenUrlIcon() {
	return <FontAwesomeIcon icon={faUpRightFromSquare} className="text-teal-300 hover:text-teal-400" />
}
export function EditIcon() {
	return <FontAwesomeIcon icon={faPenToSquare} className="text-yellow-200 hover:text-yellow-300" />
}
export function DeleteIcon() {
	return <FontAwesomeIcon icon={faTrashXmark} className="text-red-400 hover:text-red-300" />
}
export function UnarchiveIcon() {
	return <FontAwesomeIcon icon={faEye} className="text-teal-400 hover:text-teal-300" />
}
export function ArchiveIcon() {
	return <FontAwesomeIcon icon={faEyeSlash} className="text-yellow-400 hover:text-yellow-300" />
}
