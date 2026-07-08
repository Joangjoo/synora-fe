"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Navbar({ isCollapsed, onToggleSidebar }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const userRole = user?.role || "CLIENT";
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  const notifications = [
    {
      id: 1,
      dotColor: "bg-purple-500",
      title: 'Proyek "Sistem Inventaris"',
      description: "Penelusuran Selesai",
      time: "2 menit yang lalu",
    },
    {
      id: 2,
      dotColor: "bg-emerald-500",
      title: "BRD Berhasil Dibuat",
      description: "",
      time: "10 menit yang lalu",
    },
    {
      id: 3,
      dotColor: "bg-blue-500",
      title: "Arsitektur Selesai",
      description: "",
      time: "1 jam yang lalu",
    },
  ];

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
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60 leading-none mb-1">
            <span>Synora Ai</span>
            <span>/</span>
            <span className="text-purple-400 font-semibold">Dashboard</span>
          </div>
          <h2 className="text-xs font-bold text-foreground leading-none tracking-wide uppercase">
            Dashboard
          </h2>
        </div>
      </div>

      {/* Center - Search Bar */}
      <div className="relative w-80 max-w-md hidden md:block">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder="Cari sistem..."
          className="w-full h-8 rounded-lg bg-[#111113] border border-[#27272A] pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      {/* Right - Notifications & User Info */}
      <div className="flex items-center gap-4">
        {/* Notification Icon & Dropdown Panel */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer outline-none ${
              showNotifications
                ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                : "border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-500" />
          </button>

          {/* Floating Dropdown Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden z-50 text-left animate-fadeIn">
              <div className="px-4 py-3 border-b border-[#27272A] bg-[#111113] flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Notifikasi</span>
                <span className="text-[10px] text-purple-400 font-semibold cursor-pointer hover:underline">
                  Tandai sudah dibaca
                </span>
              </div>
              <div className="divide-y divide-[#27272A]/70 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-[#111113] transition-colors cursor-pointer flex gap-3 items-start"
                  >
                    {/* Color Dot */}
                    <span className={`size-2 rounded-full mt-1.5 shrink-0 ${notif.dotColor}`} />
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
                ))}
              </div>
              <div className="px-4 py-2 border-t border-[#27272A] bg-[#111113] text-center">
                <button className="text-[10px] text-muted-foreground hover:text-purple-400 font-bold tracking-wider uppercase transition-colors py-1 w-full cursor-pointer outline-none">
                  Lihat Semua Notifikasi
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
