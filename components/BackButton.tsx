'use client'

// import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BackButton() {
	const router = useRouter()

	return (
		<button
			onClick={() => router.back()}
			className="flex items-center px-2 py-2 text-base no-underline rounded-md bg-gray-950 hover:bg-gray-900 group"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>{' '}
			Back
		</button>
	)
}
