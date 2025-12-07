'use client'

import { useState, useMemo } from 'react'
import { getMyPurchases } from '@/app/actions/gifts'
import EmptyMessage from '@/components/common/EmptyMessage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PurchaseSummaryList from './PurchaseSummaryList'
import { subDays } from 'date-fns/subDays'
import { isWithinInterval } from 'date-fns/isWithinInterval'

type Timeframe = '30days' | '60days' | '6months' | '1year' | 'all'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

type PurchaseSummaryClientProps = {
	items: PurchaseItem[]
}

const isNovemberOrDecember = () => {
	const now = new Date()
	const currentMonth = now.getMonth()

	if (currentMonth === 10 || currentMonth === 11) {
		return true
	}

	return false
}

export default function PurchaseSummaryClient({ items }: PurchaseSummaryClientProps) {
	const [timeframe, setTimeframe] = useState<Timeframe>(isNovemberOrDecember() ? '30days' : '60days')

	const filteredItems = useMemo(() => {
		if (timeframe === 'all') {
			return items
		}
		if (timeframe === '30days') {
			return items.filter(
				item =>
					item.gift_created_at && isWithinInterval(new Date(item.gift_created_at), { start: subDays(new Date(), 30), end: new Date() })
			)
		}
		if (timeframe === '60days') {
			return items.filter(
				item =>
					item.gift_created_at && isWithinInterval(new Date(item.gift_created_at), { start: subDays(new Date(), 36), end: new Date() })
			)
		}
		if (timeframe === '6months') {
			return items.filter(
				item =>
					item.gift_created_at && isWithinInterval(new Date(item.gift_created_at), { start: subDays(new Date(), 180), end: new Date() })
			)
		}
		// if (timeframe === '1year') {
		return items.filter(
			item => item.gift_created_at && isWithinInterval(new Date(item.gift_created_at), { start: subDays(new Date(), 365), end: new Date() })
		)
		// }
	}, [items, timeframe])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<label htmlFor="timeframe-select" className="text-sm text-muted-foreground">
					Timeframe:
				</label>
				<Select value={timeframe} onValueChange={(value: Timeframe) => setTimeframe(value)}>
					<SelectTrigger id="timeframe-select" className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="30days">Last 30 days</SelectItem>
						<SelectItem value="60days">Last 60 days</SelectItem>
						<SelectItem value="6months">Last 6 months</SelectItem>
						<SelectItem value="1year">Last 12 months</SelectItem>
						<SelectItem value="all">All Time</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{filteredItems?.length === 0 ? (
				<EmptyMessage message="No purchases found for the selected timeframe. Try adjusting the timeframe above." />
			) : (
				<PurchaseSummaryList items={filteredItems} />
			)}
		</div>
	)
}
