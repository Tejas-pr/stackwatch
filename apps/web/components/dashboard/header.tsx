"use client";

import { Button } from "@repo/ui/components/button";
import { RefreshCw, Plus, Monitor } from "lucide-react";
import { Skeleton } from "@repo/ui/components/skeleton";
interface DashboardHeaderProps {
  onRefresh: () => void;
  onAddWebsite: () => void;
  headerData: {
    totalSites: number;
    averageUptime: number;
    issues: number;
  };
  loading: boolean;
}

export default function DashboardHeader({
  onRefresh,
  onAddWebsite,
  headerData,
  loading,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Monitor className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Website Monitor
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg">
            Real-time uptime monitoring and performance tracking for your
            websites. Stay informed about your services' health.
          </p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto sm:flex-col md:flex-row">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={onAddWebsite} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </div>
      </div>

      {loading ? (
        <HeaderStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Sites
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {headerData ? headerData.totalSites : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Average Uptime
            </p>
            <p className="mt-1 text-2xl font-bold text-accent">
              {headerData ? headerData.averageUptime : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Issues
            </p>
            <p className="mt-1 text-2xl font-bold text-destructive">
              {headerData ? headerData.issues : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-secondary/30 px-4 py-3"
        >
          {/* Title */}
          <Skeleton className="h-3 w-24 mb-2" />

          {/* Value */}
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
