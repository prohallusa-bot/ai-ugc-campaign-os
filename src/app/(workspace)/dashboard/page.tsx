"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, FileText, Film, Globe, Plus, ArrowRight, BarChart3 } from "lucide-react";

interface DashboardStats {
  offers: number;
  scripts: number;
  variations: number;
  accounts: number;
}

interface ScriptItem {
  id: string;
  conceptName: string;
  status: string;
  createdAt: string;
}

const statConfig = [
  { key: "offers" as const, label: "Active Offers", icon: Gift, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "scripts" as const, label: "Total Scripts", icon: FileText, color: "text-green-600", bg: "bg-green-50" },
  { key: "variations" as const, label: "Variations", icon: Film, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "accounts" as const, label: "Active Accounts", icon: Globe, color: "text-orange-600", bg: "bg-orange-50" },
];

function statusVariant(status: string) {
  switch (status) {
    case "APPROVED":
      return "success" as const;
    case "REVIEW":
      return "warning" as const;
    case "REJECTED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [scriptsLoading, setScriptsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ offers: 0, scripts: 0, variations: 0, accounts: 0 }))
      .finally(() => setStatsLoading(false));

    fetch("/api/scripts?pageSize=5")
      .then((res) => res.json())
      .then((data) => setScripts(data.data ?? []))
      .catch(() => setScripts([]))
      .finally(() => setScriptsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Overview of your UGC campaign production pipeline
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {stat.label}
              </CardTitle>
              <div className={`rounded-md p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.[stat.key] ?? 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Scripts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Scripts</CardTitle>
            <Link href="/scripts">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {scriptsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200" />
                  </div>
                ))}
              </div>
            ) : scripts.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No scripts yet. Create an offer and generate scripts to get
                started.
              </p>
            ) : (
              <div className="space-y-3">
                {scripts.map((script) => (
                  <div
                    key={script.id}
                    className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {script.conceptName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(script.createdAt)}
                      </p>
                    </div>
                    <Badge variant={statusVariant(script.status)}>
                      {script.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/offers/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New Offer
              </Button>
            </Link>
            <Link href="/scripts" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Scripts
              </Button>
            </Link>
            <Link href="/analytics" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
