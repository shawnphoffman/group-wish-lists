import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

type Props = { children: React.ReactNode }

export default async function AdminLayout({ children }: Props) {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const { data } = await supabase.from('view_me').select('is_admin').single()

	if (!data?.is_admin) {
		return redirect('/')
	}

	return <>{children}</>
}
