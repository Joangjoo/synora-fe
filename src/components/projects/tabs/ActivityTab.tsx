"use client";

import React from "react";
import { Clock, Activity as ActivityIcon } from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";

interface ActivityTabProps {
  projectDetail: ProjectDetailResponse;
}

export function ActivityTab({ projectDetail }: ActivityTabProps) {
  const getStageDisplayName = (key: string) => {
    const map: Record<string, string> = {
      "DISCOVERY": "Wawancara Penelusuran (Discovery)",
      "BUSINESS_ANALYSIS": "Analisis Kebutuhan Bisnis (BRD)",
      "PRODUCT_PLANNING": "Perencanaan Produk (PRD)",
      "ARCHITECTURE": "Desain Arsitektur Sistem",
      "DATABASE_DESIGN": "Desain Database & ERD",
      "BACKEND_DEV": "Pengembangan API Backend",
      "FRONTEND_DEV": "Struktur UI Frontend",
      "QA_TESTING": "Skenario Penjaminan Mutu (QA)",
      "DOCUMENTATION": "Penyusunan Panduan Pengguna",
      "DEPLOYMENT": "Konfigurasi Cloud & Deployment"
    };
    return map[key] || key;
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-left animate-fadeIn">
      <div className="flex items-center gap-2 border-b border-[#27272A] pb-3 mb-4">
        <ActivityIcon size={16} className="text-purple-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Log Aktivitas Pemrosesan Pipelines
        </h3>
      </div>
      
      <div className="relative pl-6 space-y-5 py-2 font-mono text-xs">
        <div className="absolute left-[24px] top-4 bottom-4 w-px bg-[#27272A]" />

        {projectDetail.pipeline.map((stage, idx) => (
          <div key={idx} className="relative flex gap-4 items-start text-sm select-none">
            <div className={`size-3 rounded-full border border-[#18181B] shadow-lg shrink-0 mt-1 z-10 ${
              stage.status === "COMPLETED" 
                ? "bg-emerald-500" 
                : stage.status === "IN_PROGRESS"
                ? "bg-amber-500 animate-ping"
                : "bg-[#27272A]"
            }`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 text-left">
                <div>
                  <p className="font-bold text-foreground leading-normal text-sm md:text-base">
                    {getStageDisplayName(stage.stage_name)}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                    {stage.status === "COMPLETED" 
                      ? "Proses selesai. Dokumen diunggah ke repositori." 
                      : stage.status === "IN_PROGRESS" 
                      ? "Agen AI sedang menganalisis masukan..."
                      : "Menunggu giliran eksekusi..."}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0 flex items-center gap-1 font-mono font-medium">
                  <Clock size={10} />
                  {stage.completed_at ? new Date(stage.completed_at).toLocaleTimeString("id-ID") : "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
