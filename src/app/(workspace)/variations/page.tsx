"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PLATFORM_LABELS,
  HOOK_TYPE_LABELS,
  LENGTH_LABELS,
  DELIVERY_LABELS,
} from "@/lib/constants";

interface Variation {
  id: string;
  hookType: string;
  avatarType: string;
  lengthType: string;
  deliveryRegister: string;
  platform: string;
  status: string;
  createdAt: string;
}

interface VariationBatch {
  id: string;
  name: string;
  status: string;
  scriptId: string;
  createdAt: string;
  _count?: { variations: number };
}

const BATCH_STATUS_VARIANT: Record<string, "secondary" | "warning" | "success" | "destructive"> = {
  PENDING: "secondary",
  GENERATING: "warning",
  COMPLETE: "success",
  FAILED: "destructive",
};

const VARIATION_STATUS_VARIANT: Record<string, "secondary" | "warning" | "default" | "success" | "destructive"> = {
  PENDING: "secondary",
  VOICE_QUEUED: "warning",
  VOICE_DONE: "default",
  RENDER_QUEUED: "warning",
  RENDER_DONE: "success",
  FAILED: "destructive",
};

const AVATAR_LABELS: Record<string, string> = {
  MALE_YOUNG: "Male Young",
  MALE_MIDDLE: "Male Middle",
  FEMALE_YOUNG: "Female Young",
  FEMALE_MIDDLE: "Female Middle",
  AI_GENERATED: "AI Generated",
};

export default function VariationsPage() {
  const [batches, setBatches] = useState<VariationBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [variations, setVariations] = useState<Record<string, Variation[]>>({});
  const [loadingVariations, setLoadingVariations] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const res = await fetch("/api/variation-batches");
        const json = await res.json();
        if (json.success) {
          setBatches(json.data.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBatches();
  }, []);

  async function toggleBatch(batchId: string) {
    if (expandedId === batchId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(batchId);
    if (!variations[batchId]) {
      setLoadingVariations(batchId);
      try {
        const res = await fetch(`/api/variation-batches/${batchId}/variations`);
        const json = await res.json();
        if (json.success) {
          setVariations((prev) => ({ ...prev, [batchId]: json.data }));
        }
      } finally {
        setLoadingVariations(null);
      }
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading variation batches...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Variations</h1>
        <p className="text-sm text-zinc-500">Video variation batches and production status</p>
      </div>

      <div className="space-y-4">
        {batches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleBatch(batch.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{batch.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={BATCH_STATUS_VARIANT[batch.status] ?? "secondary"}>
                    {batch.status}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    {expandedId === batch.id ? "Collapse" : "Expand"}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-zinc-500 mt-1">
                <span>Script: {batch.scriptId}</span>
                <span>Created: {new Date(batch.createdAt).toLocaleDateString()}</span>
                {batch._count && <span>Variations: {batch._count.variations}</span>}
              </div>
            </CardHeader>

            {expandedId === batch.id && (
              <CardContent>
                {loadingVariations === batch.id ? (
                  <p className="text-sm text-zinc-500">Loading variations...</p>
                ) : (variations[batch.id] ?? []).length === 0 ? (
                  <p className="text-sm text-zinc-500">No variations in this batch.</p>
                ) : (
                  <div className="space-y-3">
                    {(variations[batch.id] ?? []).map((v) => (
                      <div
                        key={v.id}
                        className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-100 p-3"
                      >
                        <Badge variant="outline">
                          {HOOK_TYPE_LABELS[v.hookType] ?? v.hookType}
                        </Badge>
                        <Badge variant="outline">
                          {AVATAR_LABELS[v.avatarType] ?? v.avatarType}
                        </Badge>
                        <Badge variant="outline">
                          {LENGTH_LABELS[v.lengthType] ?? v.lengthType}
                        </Badge>
                        <Badge variant="outline">
                          {DELIVERY_LABELS[v.deliveryRegister] ?? v.deliveryRegister}
                        </Badge>
                        <Badge variant="outline">
                          {PLATFORM_LABELS[v.platform] ?? v.platform}
                        </Badge>
                        <Badge variant={VARIATION_STATUS_VARIANT[v.status] ?? "secondary"}>
                          {v.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
        {batches.length === 0 && (
          <p className="text-zinc-500">No variation batches yet.</p>
        )}
      </div>
    </div>
  );
}
