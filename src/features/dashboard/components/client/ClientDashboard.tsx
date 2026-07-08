"use client";

import React, { useEffect, useState, useCallback } from "react";
import { WelcomeCard } from "./WelcomeCard";
import { Statistics } from "./Statistics";
import { RecentProjects } from "./RecentProjects";
import { QuickAction } from "./QuickAction";
import { RecentActivity } from "./RecentActivity";
import api from "@/lib/api";
import { BackendProject, ProjectDetailResponse } from "@/types/project";

export function ClientDashboard() {
  const [projectsDetails, setProjectsDetails] = useState<ProjectDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const projectsResp = await api.get<BackendProject[]>("/projects");
      const projects = projectsResp.data;

      const detailsPromises = projects.map((p) =>
        api.get<ProjectDetailResponse>(`/projects/${p.id}`),
      );
      const detailsResps = await Promise.all(detailsPromises);

      setProjectsDetails(detailsResps.map((r) => r.data));
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchDashboardData();
    }, 0);
    const interval = setInterval(fetchDashboardData, 5000); // Poll every 5s for real-time dashboard updates
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] w-full flex flex-col items-center justify-center gap-4 text-left">
        <div className="size-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        <p className="text-[10px] text-muted-foreground/60 font-semibold tracking-widest uppercase animate-pulse">
          Memuat Aktivitas Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full select-none text-left">
      {/* Welcome Greeting Banner */}
      <WelcomeCard />

      {/* Statistics Grid (Active, Completed, Waiting Review) */}
      <Statistics projectsDetails={projectsDetails} />

      {/* Quick Action & Double-column Project/Activity list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left side takes 2 cols for Recent Projects */}
        <div className="lg:col-span-2 w-full">
          <RecentProjects projectsDetails={projectsDetails} />
        </div>

        {/* Right side takes 1 col for Quick Actions */}
        <div className="w-full flex flex-col gap-6">
          <QuickAction />
        </div>
      </div>

      {/* Bottom row: Recent Activity timeline logs */}
      <div className="w-full">
        <RecentActivity projectsDetails={projectsDetails} />
      </div>
    </div>
  );
}
