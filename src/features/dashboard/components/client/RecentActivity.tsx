"use client";

import React from "react";
import { Activity, Clock } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      dotColor: "bg-purple-500 shadow-purple-500/20",
      project: 'Proyek "Sistem Inventaris"',
      action: "Penelusuran Selesai",
      time: "2 menit yang lalu",
    },
    {
      id: 2,
      dotColor: "bg-emerald-500 shadow-emerald-500/20",
      project: "BRD Berhasil Dibuat",
      action: "Kerangka desain sistem dasar berhasil dibuat",
      time: "10 menit yang lalu",
    },
    {
      id: 3,
      dotColor: "bg-blue-500 shadow-blue-500/20",
      project: "Arsitektur Selesai",
      action: "Garis besar arsitektur teknis telah disetujui",
      time: "1 jam yang lalu",
    },
    {
      id: 4,
      dotColor: "bg-amber-500 shadow-amber-500/20",
      project: 'Proyek "Portal SDM"',
      action: "Pembuatan Kode Sumber Dimulai",
      time: "5 jam yang lalu",
    },
  ];

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
        {/* Vertical Line */}
        <div className="absolute left-[20px] top-4 bottom-4 w-px bg-[#27272A]" />

        {activities.map((act) => (
          <div key={act.id} className="relative flex gap-4 items-start text-xs select-none">
            {/* Timeline Dot */}
            <div className={`size-3 rounded-full border border-[#18181B] shrink-0 mt-1 z-10 shadow-lg ${act.dotColor}`} />
            
            {/* Content box */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-foreground truncate">
                  {act.project}
                </p>
                <span className="text-[9px] text-muted-foreground/50 shrink-0 flex items-center gap-1">
                  <Clock size={10} />
                  {act.time}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                {act.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
