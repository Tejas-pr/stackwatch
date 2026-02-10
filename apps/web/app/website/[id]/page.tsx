'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { Card } from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'
import WebsiteDetailHeader from '../../../components/website-details/header'
import UptimeChart from '../../../components/website-details/up-time-chat'
import ResponseTimeChart from '../../../components/website-details/response-chart'
import RegionalStats from '../../../components/website-details/regional-status'

// Mock data structure based on the DB model
interface DetailData {
  id: string
  name: string
  url: string
  status: 'up' | 'down'
  uptime: number
  avgResponseTime: number
  lastUpdated: Date
  ticks: Array<{
    timestamp: Date
    responseTime: number
    status: 'Up' | 'down' | 'Unknown'
    region: string
  }>
  regions: Array<{
    name: string
    uptime: number
    avgResponseTime: number
  }>
  incidents: Array<{
    timestamp: Date
    type: 'up' | 'down'
    duration: number
  }>
}

export default function WebsiteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Mock data - in real app, fetch from API
  const [detailData] = useState<DetailData>({
    id: params.id,
    name: 'Google',
    url: 'https://google.com',
    status: 'up',
    uptime: 99.99,
    avgResponseTime: 120,
    lastUpdated: new Date(),
    ticks: Array.from({ length: 48 }, (_, i) => ({
      timestamp: new Date(Date.now() - (48 - i) * 3600000),
      responseTime: Math.floor(Math.random() * 200) + 50,
      status: Math.random() > 0.05 ? 'Up' : 'down',
      region: ['us-east', 'eu-west', 'ap-south'][Math.floor(Math.random() * 3)],
    })),
    regions: [
      { name: 'US East', uptime: 99.95, avgResponseTime: 95 },
      { name: 'EU West', uptime: 99.99, avgResponseTime: 120 },
      { name: 'AP South', uptime: 99.88, avgResponseTime: 150 },
    ],
    incidents: [
      { timestamp: new Date(Date.now() - 86400000), type: 'down', duration: 300 },
      { timestamp: new Date(Date.now() - 172800000), type: 'down', duration: 120 },
    ],
  })

  const stats = useMemo(() => {
    const upCount = detailData.ticks.filter((t) => t.status === 'Up').length
    const downCount = detailData.ticks.filter((t) => t.status === 'down').length
    const avgResponseTime =
      detailData.ticks.reduce((sum, t) => sum + t.responseTime, 0) /
      detailData.ticks.length

    return {
      upCount,
      downCount,
      avgResponseTime: Math.round(avgResponseTime),
      uptime: ((upCount / (upCount + downCount)) * 100).toFixed(2),
    }
  }, [detailData.ticks])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <WebsiteDetailHeader data={detailData} stats={stats} />

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current Status
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  detailData.status === 'up' ? 'bg-accent' : 'bg-destructive'
                } animate-pulse`}
              />
              <p className="text-2xl font-bold">
                {detailData.status === 'up' ? 'Online' : 'Offline'}
              </p>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              30-Day Uptime
            </p>
            <p className="mt-3 text-2xl font-bold text-accent">
              {stats.uptime}%
            </p>
          </Card>

          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg Response
            </p>
            <p className="mt-3 text-2xl font-bold">{stats.avgResponseTime}ms</p>
          </Card>

          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Incidents
            </p>
            <p className="mt-3 text-2xl font-bold text-destructive">
              {detailData.incidents.length}
            </p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
          <UptimeChart ticks={detailData.ticks} />
          <ResponseTimeChart ticks={detailData.ticks} />
        </div>

        {/* Regional Performance */}
        <RegionalStats regions={detailData.regions} />
      </div>
    </main>
  )
}
