import { fakeAsync } from '@/app/actions/test'

export default async function SuspenseTest() {
	const data = await fakeAsync(2500)
	return <div className="text-red-500">{JSON.stringify(data, null, 2)}</div>
}
