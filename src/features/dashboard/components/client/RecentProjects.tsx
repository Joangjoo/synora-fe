"use client";

import React from "react";
import { Folder, MoreHorizontal, ArrowUpRight } from "lucide-react";

export function RecentProjects() {
  const projects = [
    {
      name: "Sistem Inventaris",
      stage: "PENELUSURAN",
      status: "Penelusuran Selesai",
      progress: 35,
      statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      name: "Mobile E-Commerce",
      stage: "PERENCANAAN",
      status: "BRD Berhasil Dibuat",
      progress: 60,
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      name: "Portal AI Copilot",
      stage: "PRODUKSI",
      status: "Dalam Pengembangan",
      progress: 75,
      statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[340px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272A]/50 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Folder size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Proyek Terbaru
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Ikhtisar dari inisiatif terbaru Anda
            </span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-1">
        {projects.map((project) => (
          <div
            key={project.name}
            className="p-3.5 rounded-xl border border-[#27272A] bg-[#111113] hover:border-purple-500/20 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                  {project.name}
                </span>
                <span className="text-[8px] font-extrabold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
                  {project.stage}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-1 bg-[#18181B] border border-[#27272A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-muted-foreground/80 font-mono">
                  {project.progress}%
                </span>
              </div>
            </div>

            {/* Status badge & detail link */}
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${project.statusColor}`}>
                {project.status}
              </span>
              <button className="size-7 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer outline-none">
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
