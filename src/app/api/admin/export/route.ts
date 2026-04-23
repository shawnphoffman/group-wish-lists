import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const TABLES = [
	'users',
	'lists',
	'list_items',
	'list_addons',
	'gifted_items',
	'item_comments',
	'list_editors',
	'user_editors',
	'user_viewers',
] as const

type TableName = (typeof TABLES)[number]

const PAGE_SIZE = 1000

async function selectAll(supabase: ReturnType<typeof createAdminClient>, table: TableName) {
	const rows: any[] = []
	let offset = 0
	while (true) {
		const { data, error } = await supabase
			.from(table)
			.select('*')
			.range(offset, offset + PAGE_SIZE - 1)
		if (error) throw new Error(`${table}: ${error.message}`)
		if (!data?.length) break
		rows.push(...data)
		if (data.length < PAGE_SIZE) break
		offset += PAGE_SIZE
	}
	return rows
}

async function listAllAuthUsers(supabase: ReturnType<typeof createAdminClient>) {
	const rows: any[] = []
	let page = 1
	while (true) {
		const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PAGE_SIZE })
		if (error) throw new Error(`auth.users: ${error.message}`)
		const users = data?.users ?? []
		if (!users.length) break
		rows.push(
			...users.map(u => ({
				id: u.id,
				email: u.email,
				phone: u.phone,
				created_at: u.created_at,
				last_sign_in_at: u.last_sign_in_at,
				email_confirmed_at: u.email_confirmed_at,
				confirmed_at: u.confirmed_at,
				user_metadata: u.user_metadata,
				app_metadata: u.app_metadata,
			}))
		)
		if (users.length < PAGE_SIZE) break
		page += 1
	}
	return rows
}

function filenameStamp(d: Date) {
	const pad = (n: number) => String(n).padStart(2, '0')
	return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}

export async function GET() {
	const cookieStore = await cookies()
	const userClient = createClient(cookieStore)
	const { data: me } = await userClient.from('view_me').select('is_admin').returns<{ is_admin: boolean }[]>().single()

	if (!me?.is_admin) {
		return new NextResponse('Forbidden', { status: 403 })
	}

	const admin = createAdminClient()

	try {
		const tableResults = await Promise.all(TABLES.map(t => selectAll(admin, t).then(rows => [t, rows] as const)))
		const authUsers = await listAllAuthUsers(admin)

		const tables = Object.fromEntries(tableResults) as Record<TableName, any[]>
		const row_counts: Record<string, number> = {
			...Object.fromEntries(tableResults.map(([t, rows]) => [t, rows.length])),
			auth_users: authUsers.length,
		}

		const now = new Date()
		const payload = {
			meta: {
				exported_at: now.toISOString(),
				schema_version: 1,
				row_counts,
			},
			tables: {
				...tables,
				auth_users: authUsers,
			},
		}

		return new NextResponse(JSON.stringify(payload), {
			headers: {
				'Content-Type': 'application/json',
				'Content-Disposition': `attachment; filename="gwl-export-${filenameStamp(now)}.json"`,
				'Cache-Control': 'no-store',
			},
		})
	} catch (e: any) {
		console.error('[admin/export] failed', e)
		return NextResponse.json({ error: e?.message ?? 'Export failed' }, { status: 500 })
	}
}
