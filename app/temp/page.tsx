import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
	const { data } = await getUser()

	const name = data?.user?.user_metadata?.name

	return (
		<div className="flex flex-col flex-1 w-full max-w-lg gap-4 p-4 opacity-0 animate-in">
			<h1>Temp</h1>

			<div className="flex flex-col gap-2">
				<button className="btn">Button</button>
				<button className="btn green">Button</button>
				<button className="btn red">Button</button>
				<button className="btn teal">Button</button>
				<button className="btn gray">Button</button>
			</div>

			<div className="flex flex-col gap-2">
				<button className="nav-btn">Button</button>
				<button className="nav-btn green">Button</button>
				<button className="nav-btn red">Button</button>
				<button className="nav-btn teal">Button</button>
				<button className="nav-btn gray">Button</button>
			</div>
		</div>
	)
}
