import { Sidebar } from "@/components/sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">{children}</main>
    </div>
  );
}
