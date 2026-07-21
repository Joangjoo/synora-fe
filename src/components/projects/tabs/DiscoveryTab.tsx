"use client";

import React from "react";
import { ProjectDetailResponse } from "@/types/project";

interface DiscoveryTabProps {
  projectDetail: ProjectDetailResponse;
  onSendBRD?: (id: string) => void;
}

export function DiscoveryTab({
  projectDetail,
  onSendBRD,
}: DiscoveryTabProps) {
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 animate-fadeIn space-y-4">
      <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Ringkasan Hasil Penelusuran Kebutuhan</h3>
        <div className="flex items-center gap-4">
          {projectDetail.discovery?.ai_summary && projectDetail.project.approval_status !== 'APPROVED' && (
            <button
              onClick={() => onSendBRD && onSendBRD(projectDetail.project.id)}
              className="h-8 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg flex items-center gap-2 shadow-lg shadow-purple-600/20 border-none outline-none cursor-pointer transition-colors uppercase tracking-wider"
            >
              Kirim BRD ke Email Client
            </button>
          )}
          <span className="text-[11px] text-muted-foreground/80 font-bold uppercase tracking-wider font-mono">Discovery Session Transcript</span>
        </div>
      </div>
      <div className="bg-[#111113] p-6 rounded-xl border border-[#27272A] text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto scrollbar-thin">
        {projectDetail.discovery?.ai_summary ? (
          projectDetail.discovery.ai_summary
        ) : (projectDetail.discovery?.progress ?? 0) >= 90 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-purple-400">
            <div className="size-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="animate-pulse">Menyusun dokumen BRD...</span>
          </div>
        ) : (
          "Rangkuman tidak tersedia."
        )}
      </div>
    </div>
  );
}
