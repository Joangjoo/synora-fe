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
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[340px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272A]/50 pb-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Activity size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Aktivitas Terbaru
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Log sistem penyelesaian tugas agen AI
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto relative pl-4 pr-1 space-y-5 pt-2">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-muted-foreground/50 py-12">
            Belum ada aktivitas tercatat.
          </div>
        ) : (
          <>
            {/* Vertical Line */}
            <div className="absolute left-[20px] top-4 bottom-4 w-px bg-[#27272A]" />

            {activities.map((act) => (
              <div
                key={act.id}
                className="relative flex gap-4 items-start text-xs select-none animate-fadeIn"
              >
                {/* Timeline Dot */}
                <div
                  className={`size-3 rounded-full border border-[#18181B] shrink-0 mt-1 z-10 shadow-lg ${act.dotColor}`}
                />

                {/* Content box */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-foreground truncate">
                      {act.project}
                    </p>
                    <span className="text-[9px] text-muted-foreground/50 shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {act.timeStr}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
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
