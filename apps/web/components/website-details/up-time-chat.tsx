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

interface Tick {
  timestamp: Date
  responseTime: number
  status: 'Up' | 'down' | 'Unknown'
  region: string
}

interface UptimeChartProps {
  ticks: Tick[]
}

export default function UptimeChart({ ticks }: UptimeChartProps) {
  // Convert ticks to hourly aggregates
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const hourStart = new Date()
    hourStart.setHours(hourStart.getHours() - (23 - i))
    hourStart.setMinutes(0)
    hourStart.setSeconds(0)

    const hourTicks = ticks.filter((t) => {
      const tickHour = new Date(t.timestamp).getHours()
      return tickHour === hourStart.getHours()
    })

    const upCount = hourTicks.filter((t) => t.status === 'Up').length
    const totalCount = hourTicks.length || 1
    const uptime = (upCount / totalCount) * 100

    return {
      time: hourStart.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      uptime: Math.round(uptime * 100) / 100,
    }
  })

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Uptime (Last 24H)</h3>
        <p className="text-sm text-muted-foreground">Hourly uptime percentage</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ value: 'Uptime %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value) => `${value}%`}
          />
          <Line
            type="monotone"
            dataKey="uptime"
            stroke="hsl(120 100% 50%)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
