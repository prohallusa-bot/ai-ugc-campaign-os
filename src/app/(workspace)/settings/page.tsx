"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tab = "general" | "production" | "approvals" | "costs" | "integrations";

interface GlobalSettings {
  workspaceName: string;
  brandName: string;
  timezone: string;
  currency: string;
  defaultVideoGoalPerWeek: number;
  defaultPostGoalPerAccount: number;
  defaultTargetCtr: number;
  defaultTargetConversionRate: number;
  defaultTargetCac: number;
  defaultAov: number;
  defaultLtv: number;
  beginnerMode: boolean;
  advancedMode: boolean;
}

interface ProductionRules {
  videosPerWeek: number;
  hookVariantsPerScript: number;
  avatarVariantsPerHook: number;
  lengthVariants: number;
  deliveryVariants: number;
  accountsActive: number;
  postsPerAccount: number;
  approvalRequired: boolean;
}

interface ApprovalSettings {
  personaApproval: boolean;
  scriptApproval: boolean;
  hookApproval: boolean;
  voiceApproval: boolean;
  videoApproval: boolean;
  scheduleApproval: boolean;
  weeklyBriefApproval: boolean;
  autoApproveLowRisk: boolean;
  confidenceThreshold: number;
}

interface CostControlSettings {
  dailySpendCap: number | null;
  weeklySpendCap: number | null;
  pauseOnThreshold: boolean;
  warnOnCacBreak: boolean;
  costPerScript: number | null;
  costPerVoice: number | null;
  costPerVideo: number | null;
  costPerPost: number | null;
}

interface Integration {
  id: string;
  name: string;
  provider: string;
  status: string;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastError: string | null;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "production", label: "Production Rules" },
  { key: "approvals", label: "Approvals" },
  { key: "costs", label: "Cost Controls" },
  { key: "integrations", label: "Integrations" },
];

const PROVIDER_OPTIONS = [
  "OPENAI",
  "ANTHROPIC",
  "ELEVENLABS",
  "HEYGEN",
  "SYNTHESIA",
  "SUPABASE",
  "AWS_S3",
  "TIKTOK",
  "INSTAGRAM",
  "YOUTUBE",
  "FACEBOOK",
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // General
  const [global, setGlobal] = useState<GlobalSettings | null>(null);
  // Production
  const [production, setProduction] = useState<ProductionRules | null>(null);
  // Approvals
  const [approval, setApproval] = useState<ApprovalSettings | null>(null);
  // Cost Controls
  const [costControl, setCostControl] = useState<CostControlSettings | null>(null);
  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    provider: "OPENAI" as string,
    apiKeyEncrypted: "",
    baseUrl: "",
  });

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        if (activeTab === "general" && !global) {
          const res = await fetch("/api/settings/global", { signal: controller.signal });
          const json = await res.json();
          if (json.success) setGlobal(json.data);
        } else if (activeTab === "production" && !production) {
          const res = await fetch("/api/settings/production-rules", { signal: controller.signal });
          const json = await res.json();
          if (json.success) setProduction(json.data);
        } else if (activeTab === "approvals" && !approval) {
          const res = await fetch("/api/settings/approval", { signal: controller.signal });
          const json = await res.json();
          if (json.success) setApproval(json.data);
        } else if (activeTab === "costs" && !costControl) {
          const res = await fetch("/api/settings/cost-control", { signal: controller.signal });
          const json = await res.json();
          if (json.success) setCostControl(json.data);
        } else if (activeTab === "integrations") {
          const res = await fetch("/api/settings/integrations", { signal: controller.signal });
          const json = await res.json();
          if (json.success) setIntegrations(json.data);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch settings:", err);
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, [activeTab, global, production, approval, costControl]);

  async function saveSettings(url: string, data: unknown) {
    setSaving(true);
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        showMessage("success", "Settings saved successfully");
        return json.data;
      } else {
        showMessage("error", json.error?.message || "Failed to save");
        return null;
      }
    } catch {
      showMessage("error", "Failed to save settings");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveGlobal() {
    if (!global) return;
    const result = await saveSettings("/api/settings/global", global);
    if (result) setGlobal(result);
  }

  async function handleSaveProduction() {
    if (!production) return;
    const result = await saveSettings("/api/settings/production-rules", production);
    if (result) setProduction(result);
  }

  async function handleSaveApproval() {
    if (!approval) return;
    const result = await saveSettings("/api/settings/approval", approval);
    if (result) setApproval(result);
  }

  async function handleSaveCostControl() {
    if (!costControl) return;
    const result = await saveSettings("/api/settings/cost-control", costControl);
    if (result) setCostControl(result);
  }

  async function handleAddIntegration() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newIntegration,
          baseUrl: newIntegration.baseUrl || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIntegrations((prev) => [json.data, ...prev]);
        setNewIntegration({ name: "", provider: "OPENAI", apiKeyEncrypted: "", baseUrl: "" });
        showMessage("success", "Integration added");
      } else {
        showMessage("error", json.error?.message || "Failed to add integration");
      }
    } catch {
      showMessage("error", "Failed to add integration");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteIntegration(id: string) {
    try {
      const res = await fetch(`/api/settings/integrations/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setIntegrations((prev) => prev.filter((i) => i.id !== id));
        showMessage("success", "Integration removed");
      }
    } catch {
      showMessage("error", "Failed to delete integration");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500">Configure your campaign production system</p>
      </div>

      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {!global ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Workspace Name</span>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.workspaceName}
                      onChange={(e) => setGlobal({ ...global, workspaceName: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Brand Name</span>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.brandName}
                      onChange={(e) => setGlobal({ ...global, brandName: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Timezone</span>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.timezone}
                      onChange={(e) => setGlobal({ ...global, timezone: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Currency</span>
                    <input
                      type="text"
                      maxLength={3}
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.currency}
                      onChange={(e) => setGlobal({ ...global, currency: e.target.value })}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Video Goal / Week</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultVideoGoalPerWeek}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultVideoGoalPerWeek: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Posts / Account</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultPostGoalPerAccount}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultPostGoalPerAccount: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Target CTR</span>
                    <input
                      type="number"
                      step="0.001"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultTargetCtr}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultTargetCtr: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Target Conversion Rate</span>
                    <input
                      type="number"
                      step="0.001"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultTargetConversionRate}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultTargetConversionRate: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Target CAC</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultTargetCac}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultTargetCac: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Default AOV</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultAov}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultAov: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Default LTV</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={global.defaultLtv}
                      onChange={(e) =>
                        setGlobal({ ...global, defaultLtv: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={global.beginnerMode}
                      onChange={(e) => setGlobal({ ...global, beginnerMode: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">Beginner Mode</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={global.advancedMode}
                      onChange={(e) => setGlobal({ ...global, advancedMode: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">Advanced Mode</span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSaveGlobal} disabled={saving}>
                    {saving ? "Saving..." : "Save General Settings"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Production Rules Tab */}
      {activeTab === "production" && (
        <Card>
          <CardHeader>
            <CardTitle>Production Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {!production ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Videos Per Week</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.videosPerWeek}
                      onChange={(e) =>
                        setProduction({ ...production, videosPerWeek: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Hook Variants / Script</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.hookVariantsPerScript}
                      onChange={(e) =>
                        setProduction({
                          ...production,
                          hookVariantsPerScript: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Avatar Variants / Hook</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.avatarVariantsPerHook}
                      onChange={(e) =>
                        setProduction({
                          ...production,
                          avatarVariantsPerHook: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Length Variants</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.lengthVariants}
                      onChange={(e) =>
                        setProduction({ ...production, lengthVariants: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Delivery Variants</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.deliveryVariants}
                      onChange={(e) =>
                        setProduction({ ...production, deliveryVariants: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Accounts Active</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.accountsActive}
                      onChange={(e) =>
                        setProduction({ ...production, accountsActive: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Posts Per Account</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={production.postsPerAccount}
                      onChange={(e) =>
                        setProduction({ ...production, postsPerAccount: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={production.approvalRequired}
                    onChange={(e) =>
                      setProduction({ ...production, approvalRequired: e.target.checked })
                    }
                    className="rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700">Approval Required</span>
                </label>

                <div className="pt-2">
                  <Button onClick={handleSaveProduction} disabled={saving}>
                    {saving ? "Saving..." : "Save Production Rules"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approvals Tab */}
      {activeTab === "approvals" && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {!approval ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["personaApproval", "Persona Approval"],
                      ["scriptApproval", "Script Approval"],
                      ["hookApproval", "Hook Approval"],
                      ["voiceApproval", "Voice Approval"],
                      ["videoApproval", "Video Approval"],
                      ["scheduleApproval", "Schedule Approval"],
                      ["weeklyBriefApproval", "Weekly Brief Approval"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={approval[key]}
                        onChange={(e) =>
                          setApproval({ ...approval, [key]: e.target.checked })
                        }
                        className="rounded border-zinc-300"
                      />
                      <span className="text-sm text-zinc-700">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={approval.autoApproveLowRisk}
                      onChange={(e) =>
                        setApproval({ ...approval, autoApproveLowRisk: e.target.checked })
                      }
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">Auto-approve Low Risk</span>
                  </label>
                </div>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-zinc-700">
                    Confidence Threshold: {(approval.confidenceThreshold * 100).toFixed(0)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    className="w-full"
                    value={approval.confidenceThreshold}
                    onChange={(e) =>
                      setApproval({ ...approval, confidenceThreshold: Number(e.target.value) })
                    }
                  />
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </label>

                <div className="pt-2">
                  <Button onClick={handleSaveApproval} disabled={saving}>
                    {saving ? "Saving..." : "Save Approval Settings"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cost Controls Tab */}
      {activeTab === "costs" && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Controls</CardTitle>
          </CardHeader>
          <CardContent>
            {!costControl ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Daily Spend Cap</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="No limit"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={costControl.dailySpendCap ?? ""}
                      onChange={(e) =>
                        setCostControl({
                          ...costControl,
                          dailySpendCap: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Weekly Spend Cap</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="No limit"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={costControl.weeklySpendCap ?? ""}
                      onChange={(e) =>
                        setCostControl({
                          ...costControl,
                          weeklySpendCap: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={costControl.pauseOnThreshold}
                      onChange={(e) =>
                        setCostControl({ ...costControl, pauseOnThreshold: e.target.checked })
                      }
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">Pause on Threshold</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={costControl.warnOnCacBreak}
                      onChange={(e) =>
                        setCostControl({ ...costControl, warnOnCacBreak: e.target.checked })
                      }
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">Warn on CAC Break</span>
                  </label>
                </div>

                <h4 className="text-sm font-semibold text-zinc-800 pt-2">Per-Unit Costs</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["costPerScript", "Cost Per Script"],
                      ["costPerVoice", "Cost Per Voice"],
                      ["costPerVideo", "Cost Per Video"],
                      ["costPerPost", "Cost Per Post"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="space-y-1">
                      <span className="text-sm font-medium text-zinc-700">{label}</span>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Not set"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                        value={costControl[key] ?? ""}
                        onChange={(e) =>
                          setCostControl({
                            ...costControl,
                            [key]: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-2">
                  <Button onClick={handleSaveCostControl} disabled={saving}>
                    {saving ? "Saving..." : "Save Cost Controls"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              {integrations.length === 0 ? (
                <p className="text-sm text-zinc-500">No integrations configured yet.</p>
              ) : (
                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between rounded-md border border-zinc-200 p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-900">
                            {integration.name}
                          </span>
                          <Badge variant="secondary">{integration.provider}</Badge>
                          <Badge
                            variant={
                              integration.status === "CONNECTED"
                                ? "success"
                                : integration.status === "ERROR"
                                  ? "destructive"
                                  : "warning"
                            }
                          >
                            {integration.status}
                          </Badge>
                          {integration.isEnabled ? (
                            <Badge variant="success">Enabled</Badge>
                          ) : (
                            <Badge variant="secondary">Disabled</Badge>
                          )}
                        </div>
                        {integration.lastError && (
                          <p className="text-xs text-red-600">{integration.lastError}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Name</span>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={newIntegration.name}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, name: e.target.value })
                      }
                      placeholder="e.g. OpenAI Production"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Provider</span>
                    <select
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={newIntegration.provider}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, provider: e.target.value })
                      }
                    >
                      {PROVIDER_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">API Key</span>
                    <input
                      type="password"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={newIntegration.apiKeyEncrypted}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, apiKeyEncrypted: e.target.value })
                      }
                      placeholder="sk-..."
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-zinc-700">Base URL (optional)</span>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                      value={newIntegration.baseUrl}
                      onChange={(e) =>
                        setNewIntegration({ ...newIntegration, baseUrl: e.target.value })
                      }
                      placeholder="https://api.example.com"
                    />
                  </label>
                </div>
                <Button
                  onClick={handleAddIntegration}
                  disabled={saving || !newIntegration.name || !newIntegration.apiKeyEncrypted}
                >
                  {saving ? "Adding..." : "Add Integration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
