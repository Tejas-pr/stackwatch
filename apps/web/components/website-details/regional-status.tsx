'use client'

import { Card } from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'
import { Globe } from 'lucide-react'

interface Region {
  name: string
  uptime: number
  avgResponseTime: number
}

interface RegionalStatsProps {
  regions: Region[]
}

export default function RegionalStats({ regions }: RegionalStatsProps) {
  return (
    <Card className="border-border bg-card p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Regional Performance
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Uptime and response time metrics by region
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {regions.map((region) => (
          <div
            key={region.name}
            className="rounded-lg border border-border/50 bg-secondary/20 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold">{region.name}</h4>
              <Badge
                variant="outline"
                className={
                  region.uptime >= 99
                    ? 'bg-accent/20 text-accent border-accent/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }
              >
                {region.uptime.toFixed(2)}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Response Time</span>
                <span className="font-semibold">{region.avgResponseTime}ms</span>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${Math.min((region.avgResponseTime / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
