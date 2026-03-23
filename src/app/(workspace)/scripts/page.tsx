"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface Script {
  id: string;
  conceptName: string;
  hookText: string;
  status: string;
  durationSeconds: number;
  createdAt: string;
}

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  DRAFT: "secondary",
  CHECKLIST_PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  ARCHIVED: "default",
};

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scripts")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setScripts(json.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Scripts</h1>
          <p className="text-sm text-zinc-500">Manage generated UGC scripts across all offers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Loading scripts...</p>
        </div>
      ) : scripts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500">No scripts yet. Scripts will appear here once generated from offers.</p>
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
  );
}
