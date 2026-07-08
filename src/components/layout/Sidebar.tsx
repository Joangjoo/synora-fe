"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Users,
  Cpu,
  Activity,
  Database,
  BarChart3,
  Settings,
  Plus,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { useAuthStore } from "@/stores/auth.store";

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "CLIENT"; // Default to CLIENT for safety

  // Define menu items based on role (Translated to Indonesian)
  const clientMenuItems: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Proyek Saya", href: "/dashboard/projects", icon: Folder },
    { name: "Artefak", href: "#artifacts", icon: Database },
    { name: "Pengaturan", href: "#settings", icon: Settings },
  ];

  const adminMenuItems: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Proyek", href: "/dashboard/projects", icon: Folder },
    { name: "Klien", href: "#clients", icon: Users },
    {
      name: "Karyawan AI",
      href: "#ai-employees",
      icon: Cpu,
      badge: true,
    },
    { name: "Produksi", href: "#production", icon: Activity },
    { name: "Artefak", href: "#artifacts", icon: Database },
    { name: "Laporan", href: "#reports", icon: BarChart3 },
    { name: "Pengaturan", href: "#settings", icon: Settings },
  ];

  const menuItems = userRole === "CLIENT" ? clientMenuItems : adminMenuItems;

  return (
    <aside
      className={`bg-[#111113] border-r border-[#27272A] flex flex-col justify-between h-screen fixed left-0 top-0 z-30 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section - Brand Logo */}
      <div className="flex flex-col">
        <div
          className={`flex items-center gap-3 h-16 border-b border-[#27272A] transition-all duration-300 ${
            isCollapsed ? "px-6 justify-center" : "px-6"
          }`}
        >
          <div className="text-purple-600 dark:text-purple-500 shrink-0">
            <AuthLogo className="w-7 h-7" />
          </div>
          {!isCollapsed && (
            <div className="text-left animate-fadeIn">
              <h1 className="text-sm font-bold tracking-[0.15em] text-foreground uppercase leading-none">
                Synora
              </h1>
              <span className="text-[9px] font-medium text-muted-foreground/60 tracking-wider uppercase">
                AI Enterprise
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.name === "Dashboard" && pathname === "/dashboard");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-xl text-xs font-medium transition-all group border ${
                  isActive
                    ? "bg-purple-600/10 text-purple-400 border-purple-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#18181B] border-transparent"
                } ${isCollapsed ? "p-3 justify-center" : "px-3 py-2.5 justify-between"}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-purple-400"
                        : "text-muted-foreground group-hover:text-foreground transition-colors"
                    }
                  />
                  {!isCollapsed && <span className="animate-fadeIn">{item.name}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="size-2 rounded-full bg-purple-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - Action Button & User Profile */}
      <div className="p-4 space-y-4 border-t border-[#27272A] bg-[#111113]">
        {/* New Initiative / New Project Button */}
        <button
          className={`w-full h-10 rounded-xl bg-purple-500 hover:bg-purple-400 text-[#09090B] font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
            isCollapsed ? "p-0" : "gap-2 px-4"
          }`}
          title={userRole === "CLIENT" ? "Proyek Baru" : "Inisiatif Baru"}
        >
          <Plus size={14} />
          {!isCollapsed && (
            <span className="animate-fadeIn">
              {userRole === "CLIENT" ? "Proyek Baru" : "Inisiatif Baru"}
            </span>
          )}
        </button>

        {/* User profile */}
        <div
          className={`flex items-center p-2 rounded-xl hover:bg-[#18181B] transition-colors cursor-pointer group ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#27272A] border border-[#3f3f46] flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
              <User size={16} />
            </div>
            {!isCollapsed && (
              <div className="text-left animate-fadeIn">
                <p className="text-xs font-semibold text-foreground leading-none truncate max-w-[120px]">
                  {user?.full_name || "Profil CEO"}
                </p>
                <span className="text-[9px] text-muted-foreground/60 block truncate max-w-[120px]">
                  {user?.email || "izhal@synora.id"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
