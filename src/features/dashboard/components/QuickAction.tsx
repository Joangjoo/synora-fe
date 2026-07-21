"use client";

import React from "react";
import { Plus, HelpCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAction() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between h-[250px] text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400">
            <Plus size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Aksi Cepat
            </h3>
            <span className="text-xs text-muted-foreground/60">
              Picu tugas & permintaan agen AI baru
            </span>
          </div>
        </div>
      </div>

      {/* Button & Links */}
      <div className="space-y-4">
        <button
          onClick={() => router.push("/dashboard/projects?create=true")}
          className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 transition-all cursor-pointer border-none outline-none"
        >
          <Plus size={18} />
          Proyek Baru
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="h-12 rounded-xl border border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none"
          >
            <FileText size={15} />
            Periksa BRD
          </button>
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="h-12 rounded-xl border border-[#27272A] bg-[#111113] hover:bg-[#18181B] text-muted-foreground hover:text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none"
          >
            <HelpCircle size={15} />
            Bantuan
          </button>
        </div>
      </div>
    </div>
  );
}
