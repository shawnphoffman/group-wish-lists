import { Suspense } from 'react'
import { Flip, ToastContainer } from 'react-toastify'

import LogoutButton from '@/components/nav/LogoutButton'
import Nav from '@/components/nav/Nav'

import 'react-toastify/dist/ReactToastify.css'

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense>
			<div className="flex flex-col items-center flex-1 w-full gap-8">
				<nav className="flex justify-center w-full border-b border-b-foreground/10">
					<div className="flex items-center justify-between w-full max-w-4xl gap-2 p-3 text-sm">
						<Nav />
						<LogoutButton />
					</div>
				</nav>
				{children}
				<ToastContainer
					position="bottom-center"
					autoClose={2500}
					limit={2}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					pauseOnFocusLoss={false}
					draggable={false}
					pauseOnHover
					theme="dark"
					transition={Flip}
				/>
			</div>
		</Suspense>
	)
}
