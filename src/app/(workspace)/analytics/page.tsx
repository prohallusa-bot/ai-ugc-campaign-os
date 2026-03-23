"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  totalScripts: number;
  approvedScripts: number;
  totalVariations: number;
  completedVariations: number;
  totalAccounts: number;
  totalPosts: number;
  publishedPosts: number;
  recentMetrics: {
    id: string;
    views48h: number;
    views7d: number;
    watchThrough7d: number;
    ctr7d: number;
    clicks: number;
    purchases: number;
    revenue: number;
    createdAt: string;
    scheduledPost: {
      id: string;
      publishedUrl: string | null;
      account: {
        handle: string;
        platform: string;
      };
    };
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics", { signal: controller.signal });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch analytics:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
          <p className="text-sm text-zinc-500">Performance metrics and campaign insights</p>
        </div>
        <p className="text-sm text-zinc-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
          <p className="text-sm text-zinc-500">Performance metrics and campaign insights</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500">Failed to load analytics data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total Scripts", value: data.totalScripts },
    { label: "Approved Scripts", value: data.approvedScripts },
    { label: "Total Variations", value: data.totalVariations },
    { label: "Completed Variations", value: data.completedVariations },
    { label: "Active Accounts", value: data.totalAccounts },
    { label: "Published Posts", value: data.publishedPosts },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500">Performance metrics and campaign insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-900">{stat.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentMetrics.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No performance data yet. Metrics will appear once content is published and tracked.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="pb-3 pr-4 text-left font-medium text-zinc-500">Account</th>
                    <th className="pb-3 pr-4 text-left font-medium text-zinc-500">Platform</th>
                    <th className="pb-3 pr-4 text-right font-medium text-zinc-500">Views (48h)</th>
                    <th className="pb-3 pr-4 text-right font-medium text-zinc-500">Views (7d)</th>
                    <th className="pb-3 pr-4 text-right font-medium text-zinc-500">CTR</th>
                    <th className="pb-3 pr-4 text-right font-medium text-zinc-500">Clicks</th>
                    <th className="pb-3 pr-4 text-right font-medium text-zinc-500">Purchases</th>
                    <th className="pb-3 text-right font-medium text-zinc-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentMetrics.map((metric) => (
                    <tr key={metric.id} className="border-b border-zinc-100">
                      <td className="py-3 pr-4 text-zinc-900">
                        {metric.scheduledPost.account.handle}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">
                        {metric.scheduledPost.account.platform}
                      </td>
                      <td className="py-3 pr-4 text-right text-zinc-900">
                        {metric.views48h.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-zinc-900">
                        {metric.views7d.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-zinc-900">
                        {(Number(metric.ctr7d) * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 pr-4 text-right text-zinc-900">
                        {metric.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-zinc-900">
                        {metric.purchases.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-medium text-zinc-900">
                        ${Number(metric.revenue).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
