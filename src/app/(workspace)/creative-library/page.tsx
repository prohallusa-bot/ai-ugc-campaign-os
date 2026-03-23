"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Star } from "lucide-react";

type CreativeType = "HOOK" | "CTA" | "AVATAR_REF" | "VOICE_SAMPLE" | "CONCEPT" | "SCRIPT_TEMPLATE";

interface CreativeItem {
  id: string;
  name: string;
  type: CreativeType;
  content: string;
  tags: string[];
  isWinner: boolean;
  performanceScore: number | null;
  createdAt: string;
}

const TYPE_BADGE_VARIANT: Record<CreativeType, "default" | "success" | "secondary" | "warning" | "destructive" | "outline"> = {
  HOOK: "default",
  CTA: "success",
  AVATAR_REF: "secondary",
  VOICE_SAMPLE: "warning",
  CONCEPT: "destructive",
  SCRIPT_TEMPLATE: "outline",
};

const CREATIVE_TYPES: CreativeType[] = ["HOOK", "CTA", "AVATAR_REF", "VOICE_SAMPLE", "CONCEPT", "SCRIPT_TEMPLATE"];

export default function CreativeLibraryPage() {
  const [items, setItems] = useState<CreativeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CreativeType | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "HOOK" as CreativeType,
    content: "",
    tags: "",
    isWinner: false,
  });

  const fetchItems = () => {
    setLoading(true);
    fetch("/api/creative-library")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setItems(json.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = activeFilter === "ALL"
    ? items
    : items.filter((item) => item.type === activeFilter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      type: formData.type,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isWinner: formData.isWinner,
    };
    const res = await fetch("/api/creative-library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      setShowForm(false);
      setFormData({ name: "", type: "HOOK", content: "", tags: "", isWinner: false });
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/creative-library/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Creative Library</h1>
          <p className="text-sm text-zinc-500">Manage your creative assets and winning elements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Creative
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Creative</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CreativeType })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  {CREATIVE_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="e.g. urgency, social-proof, discount"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isWinner"
                  checked={formData.isWinner}
                  onChange={(e) => setFormData({ ...formData, isWinner: e.target.checked })}
                  className="rounded border-zinc-300"
                />
                <label htmlFor="isWinner" className="text-sm font-medium text-zinc-700">Winner</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("ALL")}
        >
          All
        </Button>
        {CREATIVE_TYPES.map((t) => (
          <Button
            key={t}
            variant={activeFilter === t ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(t)}
          >
            {t.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Loading creatives...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500">No creatives found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <div className="flex items-center gap-1.5">
                    {item.isWinner && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <Badge variant={TYPE_BADGE_VARIANT[item.type]}>
                      {item.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-600">
                  {item.content.length > 100
                    ? item.content.slice(0, 100) + "..."
                    : item.content}
                </p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.performanceScore !== null && item.performanceScore !== undefined && (
                  <p className="text-xs text-zinc-500">
                    Performance: <span className="font-medium">{item.performanceScore}</span>
                  </p>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
