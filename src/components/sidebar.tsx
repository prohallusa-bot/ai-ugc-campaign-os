"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gift,
  Users,
  FileText,
  Film,
  Globe,
  BarChart3,
  Settings,
  Palette,
  BookTemplate,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Offers", href: "/offers", icon: Gift },
  { label: "Personas", href: "/personas", icon: Users },
  { label: "Scripts", href: "/scripts", icon: FileText },
  { label: "Variations", href: "/variations", icon: Film },
  { label: "Accounts", href: "/accounts", icon: Globe },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Creative Library", href: "/creative-library", icon: Palette },
  { label: "Templates", href: "/templates", icon: BookTemplate },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center border-b border-zinc-200 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-zinc-900"
        >
          <Film className="h-5 w-5" />
          <span>UGC Campaign OS</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
