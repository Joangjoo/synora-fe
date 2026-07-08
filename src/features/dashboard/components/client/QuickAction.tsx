"use client";

import React from "react";
import { Plus, HelpCircle, FileText } from "lucide-react";

export function QuickAction() {
  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[200px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Plus size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Aksi Cepat
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Picu tugas & permintaan agen AI baru
            </span>
          </div>
        </div>
      </div>

      {/* Button & Links */}
      <div className="space-y-3">
        <button className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 transition-all cursor-pointer">
          <Plus size={14} />
          Proyek Baru
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button className="h-9 rounded-lg border border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <FileText size={12} />
            Periksa BRD
          </button>
          <button className="h-9 rounded-lg border border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <HelpCircle size={12} />
            Bantuan
          </button>
        </div>
      </div>
    </div>
  );
}
