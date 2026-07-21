import React from "react";
import { PipelineStage } from "@/types/project";
import { CheckCircle2, Loader2, Clock, Activity } from "lucide-react";

interface PipelineTabProps {
  pipeline: PipelineStage[];
  isApproved: boolean;
}

export function PipelineTab({ pipeline, isApproved }: PipelineTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "WAITING":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getStageDisplayName = (stageName: string) => {
    switch (stageName) {
      case "BUSINESS_ANALYSIS":
        return "Analisis Bisnis & Kebutuhan";
      case "SYSTEM_ARCHITECTURE":
        return "Arsitektur Sistem & Alur";
      case "DATABASE_DESIGN":
        return "Desain Database & Skema";
      case "API_SPECIFICATION":
        return "Spesifikasi API & Endpoint";
      case "FRONTEND_STRUCTURE":
        return "Struktur & Komponen Frontend";
      case "IMPLEMENTATION_PLAN":
        return "Rencana Implementasi Kode";
      case "CODEBASE_GENERATION":
        return "Generasi Kode Sumber (Codebase)";
      case "INTEGRATION_TESTS":
        return "Uji Integrasi & Validasi";
      case "DOCUMENTATION":
        return "Dokumentasi & Panduan Rilis";
      default:
        return stageName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
    }
  };

  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 md:p-8 animate-in fade-in">
      {!isApproved ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-300 mb-2">Pipeline Belum Berjalan</h3>
          <p className="text-zinc-500">Pipeline AI akan mulai bekerja setelah Anda menyetujui BRD.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pipeline.map((stage) => (
            <div key={stage.production_stage_id} className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  stage.status === "COMPLETED" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                  stage.status === "IN_PROGRESS" ? "bg-blue-500/10 border-blue-500/30 text-blue-500" :
                  "bg-zinc-800 border-zinc-700 text-zinc-500"
                }`}>
                  {stage.status === "COMPLETED" ? <CheckCircle2 className="w-5 h-5" /> : 
                   stage.status === "IN_PROGRESS" ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100">{getStageDisplayName(stage.stage_name)}</h4>
                  <div className="text-xs text-zinc-500 flex items-center gap-3 mt-1">
                    {stage.started_at && (
                      <span>Mulai: {new Date(stage.started_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                    {stage.completed_at && (
                      <span>Selesai: {new Date(stage.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getStatusColor(stage.status)}`}>
                {stage.status === "IN_PROGRESS" ? "Sedang dikerjakan" : stage.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
