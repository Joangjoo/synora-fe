"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Database,
  Settings,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
  isComingSoon?: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Proyek", href: "/dashboard/projects", icon: Folder },
    { name: "Tim AI", href: "/dashboard/ai-team", icon: Database },
    { name: "Klien", href: "/dashboard/clients", icon: User },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-[#111113] border-r border-[#27272A] flex flex-col justify-between h-screen fixed left-0 top-0 z-30 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section - Brand Logo */}
      <div className="flex flex-col">
        <div
          className={`flex items-center gap-3.5 h-20 border-b border-[#27272A] transition-all duration-300 ${
            isCollapsed ? "px-6 justify-center" : "px-6"
          }`}
        >
          <div className="text-purple-600 dark:text-purple-500 shrink-0 bg-purple-500/10 p-2.5 rounded-xl flex items-center justify-center">
            <span className="font-black text-base">S</span>
          </div>
          {!isCollapsed && (
            <div className="text-left animate-fadeIn">
              <h1 className="text-base font-black tracking-[0.18em] text-foreground uppercase leading-none">
                Synora
              </h1>
              <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider uppercase block mt-1">
                AI Enterprise
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-8 space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.name === "Dashboard" && pathname === "/dashboard");

            return (
              <Link
                key={item.name}
                href={item.isComingSoon ? "#" : item.href}
                onClick={(e) => {
                  if (item.isComingSoon) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center rounded-xl text-sm font-bold transition-all group border ${
                  isActive
                    ? "bg-purple-600/10 text-purple-400 border-purple-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#18181B] border-transparent"
                } ${item.isComingSoon ? "opacity-60 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground" : ""} ${
                  isCollapsed ? "p-3.5 justify-center" : "px-4 py-3.5 justify-between"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-purple-400"
                        : `text-muted-foreground transition-colors ${item.isComingSoon ? "" : "group-hover:text-foreground"}`
                    }
                  />
                  {!isCollapsed && <span className="animate-fadeIn">{item.name}</span>}
                </div>
                {!isCollapsed && item.isComingSoon && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272A] text-zinc-400 border border-[#3f3f46]">
                    Segera
                  </span>
                )}
                {!isCollapsed && item.badge && !item.isComingSoon && (
                  <span className="size-2.5 rounded-full bg-purple-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-[#27272A] bg-[#111113]">
        <div
          className={`flex items-center p-2 rounded-xl transition-colors ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3f3f46] flex items-center justify-center text-muted-foreground shrink-0">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="text-left animate-fadeIn">
                <p className="text-sm font-bold text-foreground leading-none truncate max-w-[120px] mb-1">
                  Profil CEO
                </p>
                <span className="text-[11px] font-medium text-muted-foreground/60 block truncate max-w-[120px]">
                  izhal@synora.id
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
