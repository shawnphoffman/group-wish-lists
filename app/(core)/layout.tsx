import AuthButton from '@/components/AuthButton'
import Nav from '@/components/Nav'

export default function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex-1 w-full flex flex-col gap-8 items-center">
			<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<Nav />
					<AuthButton />
				</div>
			</nav>

			{children}
		</div>
	)
}
