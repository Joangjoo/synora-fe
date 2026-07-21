"use client";

import React from "react";
import { Activity, Clock } from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";

interface RecentActivityProps {
  projectsDetails: ProjectDetailResponse[];
}

interface ActivityEvent {
  id: string;
  dotColor: string;
  project: string;
  action: string;
  timeStr: string;
  timestamp: number;
}

export function RecentActivity({ projectsDetails }: RecentActivityProps) {
  const formatRelativeTime = (dateStr: string) => {
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  const getEvents = (): ActivityEvent[] => {
    const events: ActivityEvent[] = [];

    projectsDetails.forEach((item) => {
      const proj = item.project;

      // Event 1: Project creation
      events.push({
        id: `${proj.id}-created`,
        dotColor: "bg-purple-500 shadow-purple-500/20",
        project: `Proyek "${proj.project_name}"`,
        action: "Proyek berhasil diinisiasi oleh klien",
        timeStr: formatRelativeTime(proj.created_at),
        timestamp: new Date(proj.created_at).getTime(),
      });

      // Event 2: Project completion
      if (proj.status === "COMPLETED") {
        events.push({
          id: `${proj.id}-completed`,
          dotColor: "bg-emerald-500 shadow-emerald-500/20",
          project: `Proyek "${proj.project_name}"`,
          action: "Seluruh tahapan pipeline produksi selesai dibangun!",
          timeStr: formatRelativeTime(proj.updated_at),
          timestamp: new Date(proj.updated_at).getTime(),
        });
      }

      // Event 3: Completed stages
      item.pipeline.forEach((stage) => {
        if (stage.status === "COMPLETED") {
          const compTime =
            stage.completed_at || stage.started_at || proj.updated_at;
          events.push({
            id: `${proj.id}-${stage.production_stage_id}-completed`,
            dotColor: "bg-blue-500 shadow-blue-500/20",
            project: `Proyek "${proj.project_name}"`,
            action: `Tahap ${stage.stage_name} selesai dianalisis dan dirilis oleh Agen AI`,
            timeStr: formatRelativeTime(compTime),
            timestamp: new Date(compTime).getTime(),
          });
        }
      });
    });

    // Sort by timestamp descending
    return events.sort((a, b) => b.timestamp - a.timestamp);
  };

  const activities = getEvents().slice(0, 10);

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between h-[460px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272A]/50 pb-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Aktivitas Terbaru
            </h3>
            <span className="text-xs text-muted-foreground/60">
              Log sistem penyelesaian tugas agen AI
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto relative pl-5 pr-1 space-y-6 pt-2 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground/50 py-16">
            Belum ada aktivitas tercatat.
          </div>
        ) : (
          <>
            {/* Vertical Line */}
            <div className="absolute left-[22px] top-4 bottom-4 w-px bg-[#27272A]" />

            {activities.map((act) => (
              <div
                key={act.id}
                className="relative flex gap-5 items-start text-sm select-none animate-fadeIn"
              >
                {/* Timeline Dot */}
                <div
                  className={`size-4 rounded-full border-2 border-[#18181B] shrink-0 mt-0.5 z-10 shadow-lg ${act.dotColor}`}
                />

                {/* Content box */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-black text-foreground truncate text-sm">
                      {act.project}
                    </p>
                    <span className="text-xs text-muted-foreground/50 shrink-0 flex items-center gap-1.5 font-mono">
                      <Clock size={12} />
                      {act.timeStr}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {act.action}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
