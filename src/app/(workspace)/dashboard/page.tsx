import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, FileText, Film, Globe } from "lucide-react";

const stats = [
  { label: "Active Offers", value: "—", icon: Gift, color: "text-blue-600" },
  { label: "Total Scripts", value: "—", icon: FileText, color: "text-green-600" },
  { label: "Variations", value: "—", icon: Film, color: "text-purple-600" },
  { label: "Active Accounts", value: "—", icon: Globe, color: "text-orange-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Overview of your UGC campaign production pipeline</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">No scripts yet. Create an offer and generate scripts to get started.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Production Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Pipeline status will appear here once variations are being produced.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
