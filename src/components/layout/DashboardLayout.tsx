"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuthStore } from "@/stores/auth.store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="dark min-h-screen bg-[#09090B] text-foreground flex overflow-x-hidden">
      {/* Sidebar - Dynamically adjusted width */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content Area - Dynamically adjusted padding */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Dynamic page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
