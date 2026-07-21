"use client";

import React from "react";
import { Folder, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";
import { useRouter } from "next/navigation";

interface RecentProjectsProps {
  projectsDetails: ProjectDetailResponse[];
}

export function RecentProjects({ projectsDetails }: RecentProjectsProps) {
  const router = useRouter();

  // Sort projects by updated_at descending and get top 3
  const sortedProjects = [...projectsDetails]
    .sort(
      (a, b) =>
        new Date(b.project.updated_at).getTime() -
        new Date(a.project.updated_at).getTime(),
    )
    .slice(0, 3);

  const getActiveStageName = (detail: ProjectDetailResponse) => {
    if (detail.project.status === "DRAFT") return "DISCOVERY";
    const active = detail.pipeline.find((s) => s.status === "IN_PROGRESS");
    if (active) return active.stage_name;
    const lastCompleted = [...detail.pipeline]
      .reverse()
      .find((s) => s.status === "COMPLETED");
    if (lastCompleted) return lastCompleted.stage_name;
    return "PENDING";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Sesi Discovery";
      case "SUBMITTED":
        return "Menunggu Persetujuan";
      case "IN_PROGRESS":
        return "Dalam Produksi AI";
      case "COMPLETED":
        return "Selesai Diproduksi";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "SUBMITTED":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "IN_PROGRESS":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "COMPLETED":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getProgressPercent = (detail: ProjectDetailResponse) => {
    if (detail.project.status === "DRAFT") {
      return detail.discovery?.progress || 10;
    }
    if (detail.project.status === "SUBMITTED") {
      return 20;
    }
    if (detail.project.status === "COMPLETED") {
      return 100;
    }
    const completed = detail.pipeline.filter(
      (s) => s.status === "COMPLETED",
    ).length;
    const total = detail.pipeline.length;
    return total > 0 ? Math.round((completed / total) * 100) : 50;
  };

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between h-[420px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272A]/50 pb-5 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400">
            <Folder size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Proyek Terbaru
            </h3>
            <span className="text-xs text-muted-foreground/60">
              Ikhtisar dari inisiatif terbaru Anda
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none bg-transparent border-none"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pt-1 scrollbar-thin">
        {sortedProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground/50 py-16">
            Belum ada proyek yang dibuat.
          </div>
        ) : (
          sortedProjects.map((item) => {
            const progress = getProgressPercent(item);
            const activeStage = getActiveStageName(item);
            return (
              <div
                key={item.project.id}
                className="p-5 rounded-2xl border border-[#27272A] bg-[#111113] hover:border-purple-500/20 transition-all flex items-center justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm font-black text-foreground truncate max-w-[200px]">
                      {item.project.project_name}
                    </span>
                    <span className="text-[10px] font-black tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded">
                      {activeStage}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex-1 h-2 bg-[#18181B] border border-[#27272A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-muted-foreground/85 font-mono">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Status badge & detail link */}
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusColor(item.project.status)}`}
                  >
                    {getStatusText(item.project.status)}
                  </span>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/projects?id=${item.project.id}`)
                    }
                    className="size-9 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer outline-none"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
