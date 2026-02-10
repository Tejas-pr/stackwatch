'use client'

import { Globe, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@repo/ui/components/button'

interface DetailData {
  name: string
  url: string
  status: 'up' | 'down'
  uptime: number
  lastUpdated: Date
}

interface Stats {
  uptime: string
}

interface WebsiteDetailHeaderProps {
  data: DetailData
  stats: Stats
}

export default function WebsiteDetailHeader({
  data,
  stats,
}: WebsiteDetailHeaderProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">{data.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {data.url}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {formatTime(data.lastUpdated)}
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              Visit
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
