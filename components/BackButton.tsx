'use client'

// import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BackButton() {
	const router = useRouter()

	return (
		<button
			onClick={() => router.back()}
			className="py-2 px-2 rounded-md no-underline bg-gray-950 hover:bg-gray-900 flex items-center group text-md"
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
				className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>{' '}
			Back
		</button>
	)
}
