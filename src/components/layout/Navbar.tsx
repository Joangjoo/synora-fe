"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { BackendProject, ProjectDetailResponse } from "@/types/project";

interface AppNotification {
  id: string;
  dotColor: string;
  title: string;
  description: string;
  time: string;
  project_id: string;
  timestamp: number;
}

interface NavbarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Navbar({ isCollapsed, onToggleSidebar }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const userRole = user?.role || "CLIENT";
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const formatRelativeTime = (dateStr: string) => {
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const projectsResp = await api.get<BackendProject[]>("/projects");
      const projects = projectsResp.data;

      const detailsPromises = projects.map((p) =>
        api.get<ProjectDetailResponse>(`/projects/${p.id}`),
      );
      const detailsResps = await Promise.all(detailsPromises);

      const list: AppNotification[] = [];

      detailsResps.forEach((resp) => {
        const detail = resp.data;
        const proj = detail.project;

        list.push({
          id: `${proj.id}-created`,
          dotColor: "bg-purple-500",
          title: `Proyek "${proj.project_name}"`,
          description: "Proyek berhasil diinisiasi.",
          time: formatRelativeTime(proj.created_at),
          timestamp: new Date(proj.created_at).getTime(),
          project_id: proj.id,
        });

        if (proj.status === "COMPLETED") {
          list.push({
            id: `${proj.id}-completed`,
            dotColor: "bg-emerald-500",
            title: `Proyek "${proj.project_name}" Selesai`,
            description: "Seluruh tahapan pipeline produksi telah rampung.",
            time: formatRelativeTime(proj.updated_at),
            timestamp: new Date(proj.updated_at).getTime(),
            project_id: proj.id,
          });
        }

        detail.pipeline.forEach((stage) => {
          if (stage.status === "COMPLETED") {
            const compTime =
              stage.completed_at || stage.started_at || proj.updated_at;
            list.push({
              id: `${proj.id}-${stage.production_stage_id}-completed`,
              dotColor: "bg-blue-500",
              title: `Tahap ${stage.stage_name} Selesai`,
              description: `Pekerjaan agen AI pada proyek "${proj.project_name}" telah diselesaikan.`,
              time: formatRelativeTime(compTime),
              timestamp: new Date(compTime).getTime(),
              project_id: proj.id,
            });
          }
        });
      });

      list.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(list.slice(0, 15));
      if (list.length > 0) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error("Gagal memuat notifikasi:", err);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchNotifications();
    }, 0);
    const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowProfileMenu(false);
  };

  return (
    <header className="h-16 border-b border-[#27272A] bg-[#09090B] flex items-center justify-between px-6 sticky top-0 z-20 w-full select-none">
      {/* Left - Hamburger, Breadcrumbs & Page Name */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="w-8 h-8 rounded-lg border border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer outline-none shrink-0"
          title={isCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
        >
          <Menu size={16} />
        </button>

        {/* Breadcrumb & Page title */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 leading-none mb-1">
            <span>Synora Ai</span>
            <span>/</span>
            <span className="text-purple-400 font-semibold">Dashboard</span>
          </div>
          <h2 className="text-sm font-extrabold text-foreground leading-none tracking-wide uppercase">
            Dashboard
          </h2>
        </div>
      </div>

      {/* Right - Notifications & User Info */}
      <div className="flex items-center gap-4">
        {/* Notification Icon & Dropdown Panel */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className={`relative w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer outline-none ${
              showNotifications
                ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                : "border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell size={14} />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Floating Dropdown Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden z-50 text-left animate-fadeIn">
              <div className="px-4 py-3 border-b border-[#27272A] bg-[#111113] flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Notifikasi
                </span>
                <span
                  onClick={() => setHasUnread(false)}
                  className="text-[10px] text-purple-400 font-semibold cursor-pointer hover:underline"
                >
                  Tandai sudah dibaca
                </span>
              </div>
              <div className="divide-y divide-[#27272A]/70 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground/60 font-medium">
                    Tidak ada notifikasi baru
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        router.push(`/dashboard/projects?id=${notif.project_id}`);
                        setShowNotifications(false);
                      }}
                      className="p-4 hover:bg-[#111113] transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      {/* Color Dot */}
                      <span
                        className={`size-2 rounded-full mt-1.5 shrink-0 ${notif.dotColor}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-normal">
                          {notif.title}
                        </p>
                        {notif.description && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                            {notif.description}
                          </p>
                        )}
                        <span className="text-[9px] text-muted-foreground/50 block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-[#27272A] bg-[#111113] text-center">
                <button
                  onClick={() => {
                    router.push("/dashboard/projects");
                    setShowNotifications(false);
                  }}
                  className="text-[10px] text-muted-foreground hover:text-purple-400 font-bold tracking-wider uppercase transition-colors py-1 w-full cursor-pointer outline-none"
                >
                  Lihat Semua Proyek
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown & Developer Role Switcher */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-2.5 pl-2 border-l border-[#27272A] cursor-pointer group select-none ${
              showProfileMenu ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="w-8 h-8 rounded-full border border-purple-500/30 overflow-hidden bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">
              {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "IZ"}
            </div>
            <ChevronDown size={12} className="transition-transform group-hover:translate-y-0.5" />
          </div>

          {/* Floating Dropdown Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden z-50 text-left animate-fadeIn">
              <div className="p-3 border-b border-[#27272A] bg-[#111113]">
                <p className="text-base font-bold text-foreground truncate">
                  {user?.full_name || "Profil CEO"}
                </p>
                <p className="text-sm text-muted-foreground/60 truncate">
                  {user?.email || "izhal@synora.id"}
                </p>
                <span className="inline-block text-[8px] font-extrabold tracking-widest uppercase bg-purple-500/10 border border-purple-500/35 text-purple-400 px-1.5 py-0.5 rounded mt-1.5 leading-none">
                  {userRole}
                </span>
              </div>

              {/* User standard actions */}
              <div className="p-1 space-y-0.5">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#111113] text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none">
                  <User size={14} />
                  <span>Profil Saya</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer outline-none"
                >
                  <LogOut size={14} />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
