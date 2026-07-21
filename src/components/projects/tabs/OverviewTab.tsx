"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ProjectDetailResponse, Artifact } from "@/types/project";

interface OverviewTabProps {
  projectDetail: ProjectDetailResponse;
  artifacts: Artifact[];
  onProcessRevision?: (id: string) => void;
}

export function OverviewTab({
  projectDetail,
  artifacts,
  onProcessRevision,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Deskripsi Proyek</h3>
          <p className="text-sm text-muted-foreground/85 leading-relaxed font-medium">
            Proyek ini dirancang secara otomatis dengan panduan AI. Seluruh tahapan dari penyusunan dokumen hingga deployment dijalankan secara otonom oleh tim agen AI SYNORA yang berkoordinasi secara asinkronus menggunakan dokumen-driven communication.
          </p>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Status Pelaksanaan</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium">
            <div className="p-4 bg-[#111113] border border-[#27272A] rounded-xl text-left">
              <span className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">Tahap Aktif</span>
              <p className="text-foreground text-base font-bold mt-1 uppercase font-mono tracking-wide">
                {projectDetail.project.status === "COMPLETED" ? "SELESAI" : "PRODUKSI AI"}
              </p>
            </div>
            <div className="p-4 bg-[#111113] border border-[#27272A] rounded-xl text-left">
              <span className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">Total Dokumen Rilis</span>
              <p className="text-purple-400 text-base font-bold mt-1 font-mono">
                {artifacts.length} / 9 Dokumen
              </p>
            </div>
            <div className={`p-4 rounded-xl col-span-2 md:col-span-1 border text-left ${
              projectDetail.project.approval_status === "REVISION" ? "bg-red-500/5 border-red-500/30" : "bg-[#111113] border-[#27272A]"
            }`}>
              <span className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">Status Approval</span>
              <p className={`text-base font-bold mt-1 uppercase font-mono tracking-wide ${
                  projectDetail.project.approval_status === "APPROVED" ? "text-emerald-400" :
                  projectDetail.project.approval_status === "REVISION" ? "text-red-400" :
                  projectDetail.project.approval_status === "SENT" ? "text-blue-400" :
                  "text-amber-400"
              }`}>
                {projectDetail.project.approval_status || "PENDING"}
              </p>
              {projectDetail.project.approval_status === "REVISION" && projectDetail.project.approval_note && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Catatan Klien:</span>
                    <p className="text-xs text-red-300 leading-relaxed whitespace-pre-wrap">
                      {projectDetail.project.approval_note}
                    </p>
                  </div>
                  {onProcessRevision && (
                    <button
                      onClick={() => onProcessRevision(projectDetail.project.id)}
                      className="h-8 px-3 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] rounded flex items-center justify-center gap-2 border-none outline-none cursor-pointer transition-colors uppercase tracking-wider w-full"
                    >
                      <Sparkles size={14} /> Tindak Lanjuti Revisi dengan AI
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4 text-left">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Struktur Tim AI</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-[#111113] border border-[#27272A] rounded-xl text-xs">
            <div>
              <p className="font-bold text-foreground text-sm">Business Analyst AI</p>
              <span className="text-[10px] text-muted-foreground/50 font-mono">Model: llama-3.3-70b</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">AKTIF</span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-[#111113] border border-[#27272A] rounded-xl text-xs">
            <div>
              <p className="font-bold text-foreground text-sm">System Architect AI</p>
              <span className="text-[10px] text-muted-foreground/50 font-mono">Model: llama-3.3-70b</span>
            </div>
            <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase">AKTIF</span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-[#111113] border border-[#27272A] rounded-xl text-xs">
            <div>
              <p className="font-bold text-foreground text-sm">Database Engineer AI</p>
              <span className="text-[10px] text-muted-foreground/50 font-mono">Model: llama-3.3-70b</span>
            </div>
            <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase">AKTIF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
