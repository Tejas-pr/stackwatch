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

interface ResponseTimeChartProps {
  ticks: Tick[]
}

export default function ResponseTimeChart({ ticks }: ResponseTimeChartProps) {
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

    const avgResponseTime =
      hourTicks.length > 0
        ? Math.round(
            hourTicks.reduce((sum, t) => sum + t.responseTime, 0) /
              hourTicks.length
          )
        : 0

    return {
      time: hourStart.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      responseTime: avgResponseTime,
    }
  })

  const maxResponseTime = Math.max(...chartData.map((d) => d.responseTime), 200)

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Response Time (Last 24H)</h3>
        <p className="text-sm text-muted-foreground">Average milliseconds per hour</p>
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
            domain={[0, maxResponseTime]}
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value) => `${value}ms`}
          />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="hsl(210 100% 50%)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
