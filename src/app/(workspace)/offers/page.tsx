"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface Offer {
  id: string;
  name: string;
  aov: string;
  ltv: string;
  targetCac: string;
  revenueTarget: string;
  createdAt: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setOffers(json.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Offers</h1>
          <p className="text-sm text-zinc-500">Manage your product offers and their economics</p>
        </div>
        <Link href="/offers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-zinc-500">No offers yet. Create your first offer to get started.</p>
            <Link href="/offers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Link key={offer.id} href={`/offers/${offer.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{offer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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
                      <span className="text-zinc-500">Revenue:</span>{" "}
                      <span className="font-medium">${offer.revenueTarget}</span>
                    </div>
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
