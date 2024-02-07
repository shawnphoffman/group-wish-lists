import '@/app/loading.css'

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-dvh">
			<div className="w-24 text-rose-500">
				<svg className="fa-spin-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<path
						fill="currentColor"
						d="M256 116a52 52 0 1 1 0-104 52 52 0 1 1 0 104zm0 364a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM448 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM32 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm399.4-96.2A56 56 0 1 1 352.2 80.6a56 56 0 1 1 79.2 79.2zM97.6 414.4a32 32 0 1 1 45.3-45.3A32 32 0 1 1 97.6 414.4zm271.5 0a32 32 0 1 1 45.3-45.3 32 32 0 1 1 -45.3 45.3zM86.3 86.3a48 48 0 1 1 67.9 67.9A48 48 0 1 1 86.3 86.3z"
					/>
				</svg>
			</div>
		</div>
	)
}
