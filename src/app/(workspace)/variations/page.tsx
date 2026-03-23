import { Card, CardContent } from "@/components/ui/card";

export default function VariationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Variations</h1>
        <p className="text-sm text-zinc-500">Video variation batches and production status</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Variation batches will appear here once scripts are approved and sent to production.</p>
        </CardContent>
      </Card>
    </div>
  );
}
