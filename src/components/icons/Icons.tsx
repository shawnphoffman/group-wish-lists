import React, { type CSSProperties } from 'react'
import {
	faBan,
	faBoxArchive,
	faBroom,
	faCirclePlus,
	faEye,
	faEyeSlash,
	faFileImport,
	faLockKeyhole,
	faPenToSquare,
	faRightLongToLine,
	faSpinnerScale,
	faTrashXmark,
	faUpRightFromSquare,
	faUserUnlock,
} from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { faUserGroup } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

type IconProps = {
	className?: string
} & Partial<FontAwesomeIconProps>

export function OpenUrlIcon() {
	return (
		<FontAwesomeIcon
			icon={faUpRightFromSquare}
			className="text-teal-500 hover:text-teal-600 group-hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 dark:group-hover:text-teal-300"
		/>
	)
}
export function EditIcon() {
	return (
		<FontAwesomeIcon
			icon={faPenToSquare}
			className="text-yellow-500 hover:text-yellow-600 group-hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 dark:group-hover:text-yellow-300"
		/>
	)
}
export function DeleteIcon({ className, ...rest }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={faTrashXmark}
			fixedWidth
			className={cn(
				`text-red-500 hover:text-red-600 group-hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:group-hover:text-red-300`,
				className
			)}
			{...rest}
		/>
	)
}
export function BroomIcon() {
	return (
		<FontAwesomeIcon
			icon={faBroom}
			fixedWidth
			className="text-fuchsia-500 hover:text-fuchsia-600 group-hover:text-fuchsia-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 dark:group-hover:text-fuchsia-300"
		/>
	)
}
export function UnarchiveIcon() {
	return (
		<FontAwesomeIcon icon={faEye} fixedWidth className="text-teal-500 hover:text-teal-600 dark:text-teal-600 dark:hover:text-teal-300" />
	)
}
export function ArchiveIcon() {
	return (
		<FontAwesomeIcon
			icon={faEyeSlash}
			fixedWidth
			className="text-lime-500 hover:text-lime-600 dark:text-lime-400 dark:hover:text-lime-300"
		/>
	)
}
export function ImportIcon() {
	return (
		<FontAwesomeIcon
			icon={faFileImport}
			className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
		/>
	)
}
export function AddIcon() {
	return (
		<FontAwesomeIcon
			icon={faCirclePlus}
			className="text-blue-500 hover:text-blue-600 group-hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:group-hover:text-blue-300"
		/>
	)
}
export function CancelIcon() {
	return (
		<FontAwesomeIcon
			icon={faBan}
			className="text-orange-500 hover:text-orange-600 group-hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 dark:group-hover:text-orange-300"
		/>
	)
}
export function LockIcon({ className, ...rest }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={faLockKeyhole}
			fade
			style={{ '--fa-animation-duration': '2s', '--fa-fade-opacity': '0.75' } as any}
			{...rest}
			className={`text-violet-600 dark:text-violet-300 ${className}`}
		/>
	)
}

export function PermissionsIcon({ className, ...rest }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={faUserUnlock}
			fixedWidth
			{...rest}
			className={`text-amber-600 hover:text-amber-500 group-hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-400 dark:group-hover:text-amber-400 ${className}`}
		/>
	)
}
export function ShareIcon({ className, ...rest }: IconProps) {
	return <FontAwesomeIcon icon={faUserGroup} {...rest} className={`text-emerald-600 dark:text-emerald-300 ${className}`} />
}
export function MoveIcon({ className, ...rest }: IconProps) {
	return <FontAwesomeIcon icon={faRightLongToLine} {...rest} className={`text-purple-600 dark:text-purple-300 ${className}`} />
}
export function FlushIcon({ className, ...rest }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={faBoxArchive}
			{...rest}
			className={`text-sky-600 hover:text-sky-500 group-hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-400 dark:group-hover:text-sky-400 ${className}`}
		/>
	)
}
export function LoadingIcon({ className, ...rest }: IconProps) {
	return <FontAwesomeIcon icon={faSpinnerScale} spinPulse size="2xl" {...rest} className={`text-primary ${className}`} />
}
