"use client";

import React from "react";
import { FolderGit2, CheckCircle2, Clock } from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";

interface StatisticsProps {
  projectsDetails: ProjectDetailResponse[];
}

export function Statistics({ projectsDetails }: StatisticsProps) {
  const activeCount = projectsDetails.filter(
    (p) => p.project.status === "IN_PROGRESS",
  ).length;
  const completedCount = projectsDetails.filter(
    (p) => p.project.status === "COMPLETED",
  ).length;
  const pendingCount = projectsDetails.filter(
    (p) => p.project.status === "SUBMITTED" || p.project.status === "DRAFT",
  ).length;

  const stats = [
    {
      name: "Proyek Aktif",
      value: String(activeCount),
      description: "Agen AI sedang memproses",
      icon: FolderGit2,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      name: "Proyek Selesai",
      value: String(completedCount),
      description: "Aplikasi berhasil diselesaikan",
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      name: "Proyek Menunggu Review",
      value: String(pendingCount),
      description: "Menunggu umpan balik/persetujuan",
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="border rounded-2xl p-5 flex items-center justify-between h-[100px] text-left bg-[#18181B] border-[#27272A] hover:border-purple-500/30 transition-all group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider block">
                {stat.name}
              </span>
              <span className="text-2xl font-black text-foreground leading-none block">
                {stat.value}
              </span>
              <span className="text-[9px] text-muted-foreground block truncate max-w-[200px]">
                {stat.description}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border ${stat.color} shrink-0`}>
              <Icon size={18} className={stat.iconColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
