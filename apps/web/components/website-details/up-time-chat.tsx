'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@repo/ui/components/card'

type WebsiteStatus = 'Up' | 'down' | 'Unknown'

interface TickUI {
  timestamp: Date
  responseTime: number
  status: WebsiteStatus
  region: string
}

interface UptimeChartProps {
  ticks: TickUI[]
}

export default function UptimeChart({ ticks }: UptimeChartProps) {
  const now = new Date()

  const chartData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now)
    hour.setHours(now.getHours() - (23 - i), 0, 0, 0)

    const hourTicks = ticks.filter((t) => {
      const d = new Date(t.timestamp)
      return (
        d.getHours() === hour.getHours() &&
        d.toDateString() === hour.toDateString()
      )
    })

    const total = hourTicks.length
    const up = hourTicks.filter((t) => t.status === 'Up').length

    return {
      time: hour.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      uptime: total === 0 ? 0 : Math.round((up / total) * 100),
    }
  })

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Uptime</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Line
            type="monotone"
            dataKey="uptime"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
