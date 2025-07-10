'use client'

import { useRef, useState } from 'react'
import { faSpinner, faUpload } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { uploadAvatar } from '@/app/actions/images'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileAvatarProps {
	image?: string | null
	displayName?: string | null
}

export default function ProfileAvatarUpload({ image, displayName }: ProfileAvatarProps) {
	const [_file, setFile] = useState<File | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		try {
			setIsUploading(true)
			if (file) {
				setFile(file)
				const { url } = await uploadAvatar(file)
				// console.log('ProfileAvatarUpload.url', url)
				router.refresh()
			} else {
				setFile(null)
			}
		} catch (error) {
			console.error('ProfileAvatarUpload.error', error)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<>
			<input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
			<Avatar
				className="relative flex flex-col items-center justify-center transition-all border-2 cursor-pointer w-28 h-28 border-foreground group"
				onClick={() => fileInputRef.current?.click()}
			>
				{isUploading ? (
					<>
						<div className="absolute z-20 flex items-center justify-center transition-all w-28 h-28">
							<FontAwesomeIcon icon={faSpinner} pulse size="3x" />
						</div>
						<AvatarImage src={image || undefined} className="transition-all opacity-20 grayscale" />
					</>
				) : (
					<>
						<div className="absolute z-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 w-28 h-28">
							<FontAwesomeIcon icon={faUpload} size="3x" />
						</div>
						<AvatarImage src={image || undefined} className="transition-all group-hover:grayscale group-hover:opacity-50" />
						<AvatarFallback className="text-5xl font-bold transition-opacity group-hover:opacity-0">
							{displayName?.charAt(0)}
						</AvatarFallback>
					</>
				)}
			</Avatar>
		</>
	)
}
