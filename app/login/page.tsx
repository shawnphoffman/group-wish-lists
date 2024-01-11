import { signIn } from '../actions/auth'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	return (
		<div className="flex flex-col justify-center flex-1 w-full gap-2 px-8 sm:max-w-md">
			<form className="flex flex-col justify-center flex-1 w-full gap-2 animate-in text-foreground" action={signIn}>
				<label className="label" htmlFor="email">
					Email
				</label>
				<input className="input" name="email" placeholder="you@example.com" required />
				<label className="label" htmlFor="password">
					Password
				</label>
				<input className="input" type="password" name="password" placeholder="••••••••" required />
				<button className="bg-green-700 btn">Sign In</button>
				{searchParams?.message && <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">{searchParams.message}</p>}
			</form>
		</div>
	)
}
