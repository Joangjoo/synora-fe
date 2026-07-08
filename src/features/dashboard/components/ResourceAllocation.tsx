"use client";

import React from "react";
import { Cpu } from "lucide-react";

export function ResourceAllocation() {
  const allocations = [
    { project: "Sistem Inventaris", percentage: 45, color: "bg-purple-600" },
    { project: "Mobile E-Commerce", percentage: 35, color: "bg-purple-500" },
    { project: "Portal AI Copilot", percentage: 20, color: "bg-zinc-700" },
  ];

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
          <Cpu size={14} />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Alokasi Sumber Daya
          </h3>
          <span className="text-[9px] text-muted-foreground/60">
            Anggaran komputasi token per proyek aktif
          </span>
        </div>
      </div>

      {/* Progress allocations */}
      <div className="space-y-3 py-1">
        {allocations.map((alloc) => (
          <div key={alloc.project} className="space-y-1">
            <div className="flex items-center justify-between text-[9px] font-semibold text-left">
              <span className="text-muted-foreground/80 truncate max-w-[150px]">{alloc.project}</span>
              <span className="text-foreground font-mono">{alloc.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#111113] border border-[#27272A] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${alloc.color}`}
                style={{ width: `${alloc.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer descriptor */}
      <div className="text-[9px] text-muted-foreground/60 text-left pt-2 border-t border-[#27272A]/50 truncate">
        Batas disetel ke 1,2 Juta total token bulanan
      </div>
    </div>
  );
}
