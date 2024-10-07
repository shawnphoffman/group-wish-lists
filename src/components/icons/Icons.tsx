import {
	faBan,
	faCirclePlus,
	faEye,
	faEyeSlash,
	faFileImport,
	faPenToSquare,
	faRightLongToLine,
	faTrashXmark,
	faUpRightFromSquare,
	faUserUnlock,
} from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { faLockKeyhole } from '@awesome.me/kit-ac8ad9255a/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type IconProps = {
	className?: string
}

export function OpenUrlIcon() {
	return <FontAwesomeIcon icon={faUpRightFromSquare} className="text-teal-400 hover:text-teal-300" />
}
export function EditIcon() {
	return <FontAwesomeIcon icon={faPenToSquare} className="text-yellow-400 hover:text-yellow-300 group-hover:text-yellow-300" />
}
export function DeleteIcon() {
	return <FontAwesomeIcon icon={faTrashXmark} fixedWidth className="text-red-400 hover:text-red-300 group-hover:text-red-300" />
}
export function UnarchiveIcon() {
	return <FontAwesomeIcon icon={faEye} fixedWidth className="text-teal-400 hover:text-teal-300" />
}
export function ArchiveIcon() {
	return <FontAwesomeIcon icon={faEyeSlash} fixedWidth className="text-lime-400 hover:text-lime-300" />
}
export function ImportIcon() {
	return <FontAwesomeIcon icon={faFileImport} className="text-violet-400 hover:text-violet-300" />
}
export function AddIcon() {
	return <FontAwesomeIcon icon={faCirclePlus} className="text-blue-400 hover:text-blue-300" />
}
export function CancelIcon() {
	return <FontAwesomeIcon icon={faBan} className="text-orange-400 hover:text-orange-300 group-hover:text-orange-300" />
}
export function LockIcon({ className, ...rest }: IconProps) {
	return <FontAwesomeIcon icon={faLockKeyhole} {...rest} className={`text-violet-300 ${className}`} />
}
export function PermissionsIcon({ className, ...rest }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={faUserUnlock}
			fixedWidth
			{...rest}
			className={`text-amber-300 hover:text-amber-400 group-hover:text-amber-400 ${className}`}
		/>
	)
}
export function MoveIcon({ className, ...rest }: IconProps) {
	return <FontAwesomeIcon icon={faRightLongToLine} {...rest} className={`text-purple-300 ${className}`} />
}
