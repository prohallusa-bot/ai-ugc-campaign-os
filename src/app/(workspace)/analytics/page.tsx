import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500">Performance metrics and campaign insights</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Analytics will populate once content is published and performance data is collected.</p>
        </CardContent>
      </Card>
    </div>
  );
}
