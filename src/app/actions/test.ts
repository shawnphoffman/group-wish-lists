'use server'

export const fakeAsync = async (timeout = 2000, status = 'success') => {
	'use server'
	const randomOffset = Math.floor(Math.random() * 2000)
	const randomChoice = Math.random() < 0.5 ? -1 : 1
	const randomTimeout = timeout + randomChoice * randomOffset
	return await new Promise(resolve => {
		setTimeout(() => {
			resolve({
				status,
			})
		}, randomTimeout)
	})
}
