"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { getWebsiteDetail } from "../../../server";
import UptimeChart from "../../../components/website-details/up-time-chat";
import ResponseTimeChart from "../../../components/website-details/response-chart";
import RegionalStats from "../../../components/website-details/regional-status";

type WebsiteStatus = "Up" | "down" | "Unknown";

interface TickUI {
  timestamp: Date;
  responseTime: number;
  status: WebsiteStatus;
  region: string;
}

interface RegionMetricUI {
  regionId: string;
  avgResponseTime: number;
  totalChecks: number;
}

interface WebsiteDetailUI {
  id: string;
  url: string;
  status: WebsiteStatus;
  avgResponseTime: number;
  ticks: TickUI[];
  regions: RegionMetricUI[];
}

const mapApiToUI = (apiData: any): WebsiteDetailUI => {
  const website = apiData;
  const latestTick = apiData?.ticks?.[0];

  return {
    id: website.website_details.id,
    url: website.website_details.url,
    status: latestTick?.status ?? "Unknown",

    avgResponseTime: apiData?.avg_response,

    ticks: website.ticks.map((tick: any) => ({
      timestamp: new Date(tick.time),
      responseTime: tick.response_time_ms,
      status: tick.status,
      region: tick.region_id,
    })),

    regions: apiData.region_metrics.map((r: any) => ({
      regionId: r.region_id,
      avgResponseTime: r.avg_response,
      totalChecks: r.checks,
    })),
  };
};

export default function WebsiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<WebsiteDetailUI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const apiResponse = await getWebsiteDetail(params.id, 10);
        const mapped = mapApiToUI(apiResponse);
        setData(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!data) {
    return <div className="p-8">No data found</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Status */}
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current Status
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  data.status === "Up" ? "bg-accent" : "bg-destructive"
                } animate-pulse`}
              />
              <p className="text-2xl font-bold">
                {data.status === "Up" ? "Online" : "Offline"}
              </p>
            </div>
          </Card>

          {/* Avg Response */}
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg Response Time
            </p>
            <p className="mt-3 text-2xl font-bold">
              {data.avgResponseTime.toFixed(1)} ms
            </p>
          </Card>

          {/* Total Checks */}
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Checks
            </p>
            <p className="mt-3 text-2xl font-bold">{data.ticks.length}</p>
          </Card>

          {/* URL */}
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Website
            </p>
            <p className="mt-3 font-semibold truncate">{data.url}</p>
          </Card>
        </div>

        {/* Charts */}

        <UptimeChart ticks={data.ticks} />
        <ResponseTimeChart ticks={data.ticks} />
        {/* <RegionalStats regions={data.regions} /> */}
      </div>
    </main>
  );
}
