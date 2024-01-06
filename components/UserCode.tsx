import Code from './Code'

export default function UserCode({ user }: any) {
	if (user === undefined) return null
	return <Code code={JSON.stringify(user, null, 2)} />
}
