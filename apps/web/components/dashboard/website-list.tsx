"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Card } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Trash2, ChevronRight, Circle, Activity, Clock } from "lucide-react";
import { Website } from "../../app/dashboard/page";

interface WebsiteListProps {
  websites: Website[];
  onDelete: (id: string) => void;
}

export default function x({ websites, onDelete }: any) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {websites.length === 0 ? (
        <Card className="border-border bg-card p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Activity className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No websites added yet. Click "Add Website" to get started.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="border-border hover:bg-secondary/50">
                <TableHead className="text-foreground">Website</TableHead>
                <TableHead className="text-center text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-foreground">
                  Response
                </TableHead>
                <TableHead className="text-right text-foreground">
                  Last Check
                </TableHead>
                <TableHead className="text-right text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((website: any, index: number) => (
                <TableRow
                  key={index}
                  className="border-border transition-colors hover:bg-secondary/30"
                >
                  <TableCell className="py-4">
                    <Link
                      href={`/website/${website.id}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                        <Circle
                          className={`h-5 w-5 transition-all ${
                            website.latest?.status === "Up"
                              ? "fill-accent text-accent"
                              : "fill-destructive text-destructive"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {website.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {website.url}
                        </p>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <Badge
                      variant={
                        website.latest?.status === "Up"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        website.latest?.status === "Up"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {website.latest?.status === "Up" ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right py-4">
                    {website.latest ? (
                      <>
                        <div className="font-semibold">
                          {website.latest.response_time_ms}ms
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {website.latest.response_time_ms < 100
                            ? "Fast"
                            : "Normal"}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">—</div>
                    )}
                  </TableCell>

                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {website.latest ? formatTime(website.latest.time) : "—"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/website/${website.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 h-8 px-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(website.id)}
                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete website</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
