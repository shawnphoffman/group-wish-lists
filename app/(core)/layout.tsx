import { Flip, ToastContainer } from 'react-toastify'

import AuthButton from '@/components/AuthButton'
import Nav from '@/components/Nav'

import 'react-toastify/dist/ReactToastify.css'

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center flex-1 w-full gap-8">
			<nav className="flex justify-center w-full h-16 border-b border-b-foreground/10">
				<div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
					<Nav />
					<AuthButton />
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
	)
}
