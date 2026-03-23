"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Offer {
  id: string;
  name: string;
  aov: string;
  ltv: string;
  targetCac: string;
  conversionRate: string;
  contentToClickRatio: string;
  revenueTarget: string;
  createdAt: string;
}

interface Persona {
  id: string;
  name: string;
  version: number;
  demographicJson: Record<string, unknown>;
  psychographicJson: Record<string, unknown>;
}

interface Script {
  id: string;
  conceptName: string;
  hookText: string;
  status: string;
  durationSeconds: number;
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  DRAFT: "secondary",
  CHECKLIST_PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  ARCHIVED: "default",
};

export default function OfferDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/offers/${id}`).then((r) => r.json()),
      fetch(`/api/personas?offerId=${id}`).then((r) => r.json()),
      fetch(`/api/scripts?offerId=${id}`).then((r) => r.json()),
    ])
      .then(([offerJson, personasJson, scriptsJson]) => {
        if (offerJson.success) setOffer(offerJson.data);
        if (personasJson.success) setPersonas(personasJson.data.data ?? []);
        if (scriptsJson.success) setScripts(scriptsJson.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleGenerateScripts() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/offers/${id}/generate-scripts`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        setError(json.error?.message ?? "Failed to generate scripts");
      }
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        router.push("/offers");
      } else {
        setError(json.error?.message ?? "Failed to delete offer");
      }
    } catch {
      setError("Network error");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
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
      const res = await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setOffer(json.data);
        setEditing(false);
      } else {
        setError(json.error?.message ?? "Failed to update offer");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  function summarizeJson(data: Record<string, unknown>): string {
    const entries = Object.entries(data);
    if (entries.length === 0) return "N/A";
    return entries
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
      .join(", ") + (entries.length > 3 ? "..." : "");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-zinc-500">Loading offer...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="space-y-4">
        <Link href="/offers" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft className="h-4 w-4" /> Back to Offers
        </Link>
        <p className="text-sm text-zinc-500">Offer not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/offers" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="h-4 w-4" /> Back to Offers
      </Link>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Offer Details / Edit Form */}
      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Offer Name</label>
                <input
                  name="name"
                  required
                  defaultValue={offer.name}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">AOV ($)</label>
                  <input name="aov" type="number" step="0.01" required defaultValue={offer.aov} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">LTV ($)</label>
                  <input name="ltv" type="number" step="0.01" required defaultValue={offer.ltv} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Target CAC ($)</label>
                  <input name="targetCac" type="number" step="0.01" required defaultValue={offer.targetCac} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Revenue Target ($)</label>
                  <input name="revenueTarget" type="number" step="0.01" required defaultValue={offer.revenueTarget} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Conversion Rate (0-1)</label>
                  <input name="conversionRate" type="number" step="0.0001" min="0" max="1" required defaultValue={offer.conversionRate} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Content-to-Click Ratio (0-1)</label>
                  <input name="contentToClickRatio" type="number" step="0.0001" min="0" max="1" required defaultValue={offer.contentToClickRatio} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{offer.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(true)}>Edit Offer</Button>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Are you sure?</span>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Deleting..." : "Confirm"}
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete Offer</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="text-zinc-500">AOV:</span>{" "}
                <span className="font-medium">${offer.aov}</span>
              </div>
              <div>
                <span className="text-zinc-500">LTV:</span>{" "}
                <span className="font-medium">${offer.ltv}</span>
              </div>
              <div>
                <span className="text-zinc-500">Target CAC:</span>{" "}
                <span className="font-medium">${offer.targetCac}</span>
              </div>
              <div>
                <span className="text-zinc-500">Conversion Rate:</span>{" "}
                <span className="font-medium">{offer.conversionRate}</span>
              </div>
              <div>
                <span className="text-zinc-500">Content-to-Click:</span>{" "}
                <span className="font-medium">{offer.contentToClickRatio}</span>
              </div>
              <div>
                <span className="text-zinc-500">Revenue Target:</span>{" "}
                <span className="font-medium">${offer.revenueTarget}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personas Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Personas</h2>
        {personas.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-sm text-zinc-500">No personas yet for this offer.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {personas.map((persona) => (
              <Card key={persona.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{persona.name}</CardTitle>
                    <Badge variant="outline">v{persona.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-zinc-700">Demographic:</span>{" "}
                    <span className="text-zinc-500">{summarizeJson(persona.demographicJson)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700">Psychographic:</span>{" "}
                    <span className="text-zinc-500">{summarizeJson(persona.psychographicJson)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Scripts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Scripts</h2>
          <Button onClick={handleGenerateScripts} disabled={generating}>
            {generating ? "Generating..." : "Generate Scripts"}
          </Button>
        </div>
        {scripts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-sm text-zinc-500">No scripts yet. Click &quot;Generate Scripts&quot; to create them.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {scripts.map((script) => (
              <Link key={script.id} href={`/scripts/${script.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-zinc-900">{script.conceptName}</h3>
                        <Badge variant={statusVariant[script.status] ?? "secondary"}>{script.status}</Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-zinc-500">{script.hookText}</p>
                    </div>
                    <div className="ml-4 text-right text-sm text-zinc-500">
                      {script.durationSeconds}s
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
