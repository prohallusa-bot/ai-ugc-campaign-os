import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500">Configure your campaign production system</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Configure AI providers, voice synthesis, and video rendering integrations.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Set up automation rules for the content production pipeline.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Configure script approval thresholds and workflows.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Set budget limits and cost alerts for AI and production services.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
