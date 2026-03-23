"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Script {
  id: string;
  conceptName: string;
  hookText: string;
  painText: string;
  mechanismText: string;
  solutionText: string;
  transformationText: string;
  ctaText: string;
  fullScript: string;
  status: string;
  durationSeconds: number;
  offerId: string;
  personaId: string;
  createdAt: string;
}

interface Checklist {
  id: string;
  scriptId: string;
  score: number;
  notes: string | null;
  createdAt: string;
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  DRAFT: "secondary",
  CHECKLIST_PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  ARCHIVED: "default",
};

const scriptSections = [
  { key: "hookText", title: "Hook" },
  { key: "painText", title: "Pain" },
  { key: "mechanismText", title: "Mechanism" },
  { key: "solutionText", title: "Solution" },
  { key: "transformationText", title: "Transformation" },
  { key: "ctaText", title: "CTA" },
] as const;

export default function ScriptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [script, setScript] = useState<Script | null>(null);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/scripts/${id}`).then((r) => r.json()),
      fetch(`/api/scripts/${id}/checklists`).then((r) => r.json()),
    ])
      .then(([scriptJson, checklistsJson]) => {
        if (scriptJson.success) setScript(scriptJson.data);
        if (checklistsJson.success) setChecklists(checklistsJson.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status: string) {
    setStatusUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/scripts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setScript(json.data);
      } else {
        setError(json.error?.message ?? "Failed to update status");
      }
    } catch {
      setError("Network error");
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleCreateVariationBatch() {
    if (!script) return;
    setCreatingBatch(true);
    setError(null);
    try {
      const res = await fetch("/api/variation-batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptId: script.id,
          name: `Batch - ${script.conceptName}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/variations`);
      } else {
        setError(json.error?.message ?? "Failed to create variation batch");
      }
    } catch {
      setError("Network error");
    } finally {
      setCreatingBatch(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-zinc-500">Loading script...</p>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="space-y-4">
        <Link href="/scripts" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft className="h-4 w-4" /> Back to Scripts
        </Link>
        <p className="text-sm text-zinc-500">Script not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/scripts" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="h-4 w-4" /> Back to Scripts
      </Link>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Script Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>{script.conceptName}</CardTitle>
              <Badge variant={statusVariant[script.status] ?? "secondary"}>{script.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateVariationBatch} disabled={creatingBatch}>
                {creatingBatch ? "Creating..." : "Create Variation Batch"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-zinc-500">Duration:</span>{" "}
              <span className="font-medium">{script.durationSeconds}s</span>
            </div>
            <div>
              <span className="text-zinc-500">Offer ID:</span>{" "}
              <span className="font-medium">{script.offerId}</span>
            </div>
            <div>
              <span className="text-zinc-500">Persona ID:</span>{" "}
              <span className="font-medium">{script.personaId}</span>
            </div>
            <div>
              <span className="text-zinc-500">Created:</span>{" "}
              <span className="font-medium">{new Date(script.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleStatusChange("APPROVED")}
              disabled={statusUpdating || script.status === "APPROVED"}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange("REJECTED")}
              disabled={statusUpdating || script.status === "REJECTED"}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange("ARCHIVED")}
              disabled={statusUpdating || script.status === "ARCHIVED"}
            >
              Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Script Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Script Sections</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {scriptSections.map(({ key, title }) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-zinc-700">{script[key]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Script */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Full Script</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm text-zinc-700">{script.fullScript}</p>
        </CardContent>
      </Card>

      {/* Checklists */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Checklists</h2>
        {checklists.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-sm text-zinc-500">No checklists yet for this script.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {checklists.map((checklist) => (
              <Card key={checklist.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-sm font-medium text-zinc-900">Score: {checklist.score}</span>
                    {checklist.notes && (
                      <p className="mt-1 text-sm text-zinc-500">{checklist.notes}</p>
                    )}
                  </div>
                  <span className="text-sm text-zinc-500">
                    {new Date(checklist.createdAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
