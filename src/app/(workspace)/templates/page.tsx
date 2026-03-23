"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

type TemplateCategory = "HOOK_GENERATION" | "SCRIPT_WRITING" | "PERSONA_RESEARCH" | "CHECKLIST_SCORING" | "WEEKLY_REVIEW" | "OPTIMIZATION";

interface PromptTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  content: string;
  version: number;
  isDefault: boolean;
  createdAt: string;
}

const CATEGORY_BADGE_VARIANT: Record<TemplateCategory, "default" | "success" | "secondary" | "warning" | "destructive" | "outline"> = {
  HOOK_GENERATION: "default",
  SCRIPT_WRITING: "success",
  PERSONA_RESEARCH: "secondary",
  CHECKLIST_SCORING: "warning",
  WEEKLY_REVIEW: "destructive",
  OPTIMIZATION: "outline",
};

const CATEGORIES: TemplateCategory[] = [
  "HOOK_GENERATION",
  "SCRIPT_WRITING",
  "PERSONA_RESEARCH",
  "CHECKLIST_SCORING",
  "WEEKLY_REVIEW",
  "OPTIMIZATION",
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "HOOK_GENERATION" as TemplateCategory,
    content: "",
    isDefault: false,
  });

  const fetchTemplates = () => {
    setLoading(true);
    fetch("/api/prompt-templates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setTemplates(json.data.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/prompt-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.success) {
      setShowForm(false);
      setFormData({ name: "", category: "HOOK_GENERATION", content: "", isDefault: false });
      fetchTemplates();
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/prompt-templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    const json = await res.json();
    if (json.success) {
      setEditingId(null);
      setEditContent("");
      fetchTemplates();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/prompt-templates/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const startEditing = (template: PromptTemplate) => {
    setEditingId(template.id);
    setEditContent(template.content);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Prompt Templates</h1>
          <p className="text-sm text-zinc-500">Manage AI prompt templates for content generation</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Template</CardTitle>
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
                <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TemplateCategory })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-zinc-300"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-zinc-700">Set as default</label>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500">No templates yet. Create your first template to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant={CATEGORY_BADGE_VARIANT[template.category]}>
                      {template.category.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-zinc-400">v{template.version}</span>
                    {template.isDefault && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editingId === template.id
                          ? setEditingId(null)
                          : startEditing(template)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === template.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={8}
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(template.id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                    {template.content.length > 200
                      ? template.content.slice(0, 200) + "..."
                      : template.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
