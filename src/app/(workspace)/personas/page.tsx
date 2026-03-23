"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Persona {
  id: string;
  name: string;
  offerId: string;
  version: number;
  createdAt: string;
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/personas")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPersonas(json.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Personas</h1>
        <p className="text-sm text-zinc-500">Target audience personas for your offers</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Loading personas...</p>
        </div>
      ) : personas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500">No personas yet. Personas are auto-generated when you create an offer.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{persona.name}</CardTitle>
                  <Badge variant="secondary">v{persona.version}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Offer: {persona.offerId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
