"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/stores/auth.store";

// Split page views based on role
import { ClientDashboard } from "@/features/dashboard/components/client/ClientDashboard";
import { EnterpriseDashboard } from "@/features/dashboard/components/enterprise/EnterpriseDashboard";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    hydrate();
    const timer = setTimeout(() => setIsLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [hydrate]);

  // Determine dashboard view based on active user role
  const userRole = user?.role || "CLIENT";

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 text-left">
          {/* Subtle loading spinner with purple accent */}
          <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          <p className="text-xs text-muted-foreground/60 font-semibold tracking-widest uppercase animate-pulse">
            Synchronizing Workspace...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {userRole === "CLIENT" ? (
        <ClientDashboard />
      ) : (
        <EnterpriseDashboard />
      )}
    </DashboardLayout>
  );
}
