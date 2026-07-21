"use client";

import React from "react";
import { 
  Folder, 
  Cpu, 
  Layers, 
  FileText, 
  Database, 
  Server, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CloudLightning 
} from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";

interface PipelineTabProps {
  projectDetail: ProjectDetailResponse;
}

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export function PipelineTab({ projectDetail }: PipelineTabProps) {
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

  const getStageIcon = (key: string) => {
    switch (key) {
      case "DISCOVERY": return Cpu;
      case "BUSINESS_ANALYSIS": return FileText;
      case "PRODUCT_PLANNING": return Layers;
      case "ARCHITECTURE": return CodeIcon;
      case "DATABASE_DESIGN": return Database;
      case "BACKEND_DEV": return Server;
      case "FRONTEND_DEV": return Sparkles;
      case "QA_TESTING": return ShieldCheck;
      case "DOCUMENTATION": return BookOpen;
      case "DEPLOYMENT": return CloudLightning;
      default: return Folder;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-6">
        <div className="border-b border-[#27272A] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
            Status Antrean Pipeline Produksi
          </h3>
          <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Otonom</span>
        </div>

        {/* Pipeline timeline stages */}
        <div className="relative pl-6 space-y-5">
          <div className="absolute left-[35px] top-4 bottom-4 w-px bg-[#27272A]" />
          
          {projectDetail.pipeline.map((stage) => {
            const Icon = getStageIcon(stage.stage_name);
            return (
              <div key={stage.production_stage_id} className="relative flex gap-4 items-center text-sm">
                <div className={`size-10 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                  stage.status === "COMPLETED" 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                    : stage.status === "IN_PROGRESS"
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-500 animate-pulse shadow-lg shadow-amber-500/5"
                    : "bg-[#111113] border-[#27272A] text-muted-foreground/40"
                }`}>
                  <Icon size={15} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-left">
                    <p className={`font-bold text-sm md:text-base ${stage.status === "IN_PROGRESS" ? "text-amber-500 animate-pulse" : "text-foreground"}`}>
                      {getStageDisplayName(stage.stage_name)}
                    </p>
                    <span className={`text-[10px] font-mono font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${
                      stage.status === "COMPLETED" 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : stage.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-[#111113] text-muted-foreground/30"
                    }`}>
                      {stage.status === "COMPLETED" ? "SELESAI" : stage.status === "IN_PROGRESS" ? "PROSES" : "MENUNGGU"}
                    </span>
                  </div>
                  {(stage.started_at || stage.completed_at) && (
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono font-medium text-left">
                      {stage.started_at && `Mulai: ${new Date(stage.started_at).toLocaleTimeString("id-ID")}`} 
                      {stage.completed_at && ` • Selesai: ${new Date(stage.completed_at).toLocaleTimeString("id-ID")}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="space-y-4">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground border-b border-[#27272A] pb-3 text-left">Status Kinerja Tim AI</h3>
          <div className="space-y-4">
            {projectDetail.pipeline.map((stage) => {
              if (stage.status !== "IN_PROGRESS") return null;
              return (
                <div key={stage.production_stage_id} className="p-5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">Pemimpin Tahap: {getStageDisplayName(stage.stage_name)}</span>
                    <span className="text-[10px] font-mono text-purple-400 font-extrabold uppercase tracking-wider animate-pulse">SEDANG BEKERJA</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Agen AI sedang mengkaji berkas masukan dari tahap sebelumnya dan menulis output dokumentasi Markdown terstruktur. Estimasi selesai: 1-2 menit.
                  </p>
                </div>
              );
            })}
            {projectDetail.project.status === "COMPLETED" && (
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-left">
                <span className="text-sm font-bold text-emerald-400 block">Seluruh Agen AI Selesai Bekerja</span>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Seluruh dokumen arsitektur teknis dan panduan cloud deployment berhasil diselesaikan secara berantai. Berkas siap diunduh di tab Dokumen.
                </p>
              </div>
            )}
            {projectDetail.project.status === "SUBMITTED" && (
              <div className="p-5 bg-[#111113] border border-[#27272A] rounded-xl text-left">
                <p className="text-sm text-muted-foreground/60 font-medium">
                  Menunggu persetujuan CEO/COO untuk memulai pekerjaan otomatis para agen AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
