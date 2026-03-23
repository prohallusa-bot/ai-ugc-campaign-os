"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_LABELS, ACCOUNT_TIER_LABELS } from "@/lib/constants";

interface Account {
  id: string;
  platform: string;
  handle: string;
  tier: string;
  healthStatus: string;
  warmthDay: number;
  dailyPostTarget: number;
  createdAt: string;
}

const HEALTH_VARIANT: Record<string, "success" | "warning" | "destructive"> = {
  HEALTHY: "success",
  WARNING: "warning",
  RESTRICTED: "destructive",
  BANNED: "destructive",
};

const TIER_VARIANT: Record<string, "secondary" | "default" | "success"> = {
  SEED: "secondary",
  GROWTH: "default",
  SCALE: "success",
};

const PLATFORMS = ["TIKTOK", "INSTAGRAM_REELS", "YOUTUBE_SHORTS", "FACEBOOK_REELS"] as const;
const TIERS = ["SEED", "GROWTH", "SCALE"] as const;

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: "TIKTOK",
    handle: "",
    tier: "SEED",
    dailyPostTarget: 3,
  });

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/accounts");
      const json = await res.json();
      if (json.success) {
        setAccounts(json.data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        dailyPostTarget: Number(formData.dailyPostTarget),
      }),
    });
    const json = await res.json();
    if (json.success) {
      setAccounts((prev) => [json.data, ...prev]);
      setShowForm(false);
      setFormData({ platform: "TIKTOK", handle: "", tier: "SEED", dailyPostTarget: 3 });
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading accounts...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Accounts</h1>
          <p className="text-sm text-zinc-500">Social media accounts for content distribution</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Account"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-medium">Platform</span>
                <select
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium">Handle</span>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="@username"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium">Tier</span>
                <select
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                >
                  {TIERS.map((t) => (
                    <option key={t} value={t}>
                      {ACCOUNT_TIER_LABELS[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium">Daily Post Target</span>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  min={1}
                  value={formData.dailyPostTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, dailyPostTarget: Number(e.target.value) })
                  }
                />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{account.handle}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(account.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{PLATFORM_LABELS[account.platform] ?? account.platform}</Badge>
                <Badge variant={TIER_VARIANT[account.tier] ?? "secondary"}>
                  {ACCOUNT_TIER_LABELS[account.tier] ?? account.tier}
                </Badge>
                <Badge variant={HEALTH_VARIANT[account.healthStatus] ?? "secondary"}>
                  {account.healthStatus}
                </Badge>
              </div>
              <div className="text-sm text-zinc-500 space-y-1">
                <p>Warmth Day: {account.warmthDay}</p>
                <p>Daily Target: {account.dailyPostTarget}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {accounts.length === 0 && (
          <p className="text-zinc-500 col-span-full">No accounts yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
}
