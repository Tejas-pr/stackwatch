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
  timestamp: Date | string
  responseTime: number
  status: 'Up' | 'down' | 'Unknown'
  region: string
}

interface ResponseTimeChartProps {
  ticks: Tick[]
}

export default function ResponseTimeChart({ ticks }: ResponseTimeChartProps) {
  // Sort ticks by time (important)
  const chartData = [...ticks]
    .map((t) => ({
      time: new Date(t.timestamp),
      responseTime: t.responseTime,
    }))
    .sort((a, b) => a.time.getTime() - b.time.getTime())
    .map((t) => ({
      time: t.time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      responseTime: t.responseTime,
    }))

  const maxResponseTime = Math.max(
    200,
    ...chartData.map((d) => d.responseTime)
  )

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Response Time</h3>
        <p className="text-sm text-muted-foreground">
          One point per check (~3 minutes)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />

          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            domain={[0, maxResponseTime]}
            label={{
              value: 'Response Time (ms)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value) => `${value} ms`}
            labelFormatter={(label) => `Time: ${label}`}
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
