"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewOfferPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      aov: Number(formData.get("aov")),
      ltv: Number(formData.get("ltv")),
      targetCac: Number(formData.get("targetCac")),
      conversionRate: Number(formData.get("conversionRate")),
      contentToClickRatio: Number(formData.get("contentToClickRatio")),
      revenueTarget: Number(formData.get("revenueTarget")),
    };

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/offers");
      } else {
        setError(json.error?.message ?? "Failed to create offer");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">New Offer</h1>
        <p className="text-sm text-zinc-500">Define the economics for a new product offer</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Offer Name</label>
              <input
                name="name"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="e.g., Premium Skincare Bundle"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">AOV ($)</label>
                <input name="aov" type="number" step="0.01" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">LTV ($)</label>
                <input name="ltv" type="number" step="0.01" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Target CAC ($)</label>
                <input name="targetCac" type="number" step="0.01" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Revenue Target ($)</label>
                <input name="revenueTarget" type="number" step="0.01" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Conversion Rate (0-1)</label>
                <input name="conversionRate" type="number" step="0.0001" min="0" max="1" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Content-to-Click Ratio (0-1)</label>
                <input name="contentToClickRatio" type="number" step="0.0001" min="0" max="1" required className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Offer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
