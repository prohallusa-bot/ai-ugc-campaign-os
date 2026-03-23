import { Card, CardContent } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Accounts</h1>
        <p className="text-sm text-zinc-500">Social media accounts for content distribution</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-zinc-500">Connect your social media accounts to start distributing content.</p>
        </CardContent>
      </Card>
    </div>
  );
}
