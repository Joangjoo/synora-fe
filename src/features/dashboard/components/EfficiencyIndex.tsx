"use client";

import React from "react";
import { Zap, DollarSign } from "lucide-react";

export function EfficiencyIndex() {
  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
          <Zap size={14} />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Indeks Efisiensi
          </h3>
          <span className="text-[9px] text-muted-foreground/60">
            Rasio kecepatan AI vs kapasitas developer manusia
          </span>
        </div>
      </div>

      {/* Main Metric Stats */}
      <div className="grid grid-cols-2 gap-4 items-center py-2">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase">
            Peningkatan Kecepatan
          </span>
          <span className="text-2xl font-black text-purple-400 mt-0.5 leading-none">
            8.4x
          </span>
          <span className="text-[8px] text-muted-foreground/80 mt-1">
            Percepatan eksekusi tugas
          </span>
        </div>
        <div className="flex flex-col text-left border-l border-[#27272A] pl-4">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase">
            Perkiraan Hemat
          </span>
          <span className="text-xl font-bold text-foreground mt-0.5 leading-none flex items-center">
            <DollarSign size={16} className="text-purple-500 -ml-1" />
            12.450
          </span>
          <span className="text-[8px] text-muted-foreground/80 mt-1">
            Penghematan vs biaya manual
          </span>
        </div>
      </div>

      {/* Footer descriptor */}
      <div className="text-[9px] text-muted-foreground/60 text-left pt-2 border-t border-[#27272A]/50 truncate">
        Dihitung berdasarkan 582.042 token yang diproses
      </div>
    </div>
  );
}
