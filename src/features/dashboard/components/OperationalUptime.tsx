"use client";

import React from "react";
import { Activity } from "lucide-react";

export function OperationalUptime() {
  // Mock uptime representation values for 28 daily cycles
  const uptimeDays = [
    100, 100, 100, 99.8, 100, 100, 100, 100, 100, 100, 99.5, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  ];

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Activity size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Uptime Operasional
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Ketersediaan sistem selama 28 hari terakhir
            </span>
          </div>
        </div>
      </div>

      {/* Grid of uptime bars */}
      <div className="flex flex-col gap-2 py-1.5 text-left">
        <div className="flex items-end gap-1 justify-between h-9 px-1">
          {uptimeDays.map((val, idx) => {
            const heightPercent = val === 100 ? "h-full" : val >= 99.8 ? "h-[85%]" : "h-[70%]";
            const colorClass =
              val === 100
                ? "bg-purple-500/80 hover:bg-purple-400"
                : val >= 99.8
                ? "bg-purple-600/60 hover:bg-purple-500"
                : "bg-zinc-600 hover:bg-zinc-500";

            return (
              <div
                key={idx}
                className={`flex-1 rounded-sm transition-colors cursor-pointer ${heightPercent} ${colorClass}`}
                title={`Hari ${idx + 1}: ${val}% Uptime`}
              />
            );
          })}
        </div>

        {/* Avg statistic label */}
        <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground/60">
          <span>28 hari lalu</span>
          <span className="text-purple-400">Uptime Rata-rata: 99.98%</span>
          <span>Hari ini</span>
        </div>
      </div>

      {/* Footer descriptor */}
      <div className="text-[9px] text-muted-foreground/60 text-left pt-2 border-t border-[#27272A]/50 truncate">
        Eksekusi bebas insiden selama 14 hari berturut-turut
      </div>
    </div>
  );
}
