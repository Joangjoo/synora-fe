"use client";

import React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ProjectDetailResponse } from "@/types/project";

interface ProjectDetailHeaderProps {
  projectDetail: ProjectDetailResponse;
  onBack: () => void;
}

export function ProjectDetailHeader({
  projectDetail,
  onBack,
}: ProjectDetailHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "SUBMITTED":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "IN_PROGRESS":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "COMPLETED":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      default:
        return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    }
  };

  const getStatusIndonesian = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Penelusuran AI";
      case "SUBMITTED":
        return "Menunggu Review";
      case "IN_PROGRESS":
        return "Produksi AI";
      case "COMPLETED":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none border-none bg-transparent mb-6 font-bold"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Proyek
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 text-left">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {projectDetail.project.project_name}
            </h1>
            <span
              className={`text-[11px] font-extrabold tracking-widest uppercase border px-3 py-1 rounded leading-none mt-1 ${getStatusColor(projectDetail.project.status)}`}
            >
              {getStatusIndonesian(projectDetail.project.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground/90 max-w-2xl leading-relaxed font-semibold text-left">
            {projectDetail.project.status === "DRAFT"
              ? "Lakukan tanya jawab terstruktur dengan Business Analyst AI untuk merancang spesifikasi kebutuhan dasar proyek Anda."
              : "Pantau perkembangan analisis, desain arsitektur, skema basis data, dan kode program yang digarap secara otonom oleh para agen AI."}
          </p>
          <div className="flex gap-4 items-center text-xs text-muted-foreground/70 mt-3 font-mono font-medium">
            <span>
              Dibuat:{" "}
              {new Date(
                projectDetail.project.created_at,
              ).toLocaleDateString("id-ID")}
            </span>
            <span>•</span>
            <span>
              ID Proyek:{" "}
              {projectDetail.project.id.substring(0, 8)}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-[#18181B] border border-[#27272A] px-6 py-4 rounded-xl flex items-center gap-5 min-w-[260px]">
          <div className="flex-1 text-left">
            <span className="text-[11px] font-extrabold text-muted-foreground/60 uppercase block tracking-wider">
              Kemajuan Proses
            </span>
            <span className="text-2xl font-black text-foreground font-mono">
              {projectDetail.project.status === "DRAFT"
                ? (projectDetail.discovery?.progress || 10)
                : projectDetail.project.status === "SUBMITTED"
                  ? 20
                  : projectDetail.project.status === "COMPLETED"
                    ? 100
                    : 50 
              }%
            </span>
            <span className="text-[11px] text-purple-400 block mt-0.5 font-bold">
              {projectDetail.project.status === "DRAFT"
                ? "Wawancara Klien"
                : "Pipeline Produksi"}
            </span>
          </div>
          {projectDetail.project.status === "COMPLETED" ||
          (projectDetail.project.status === "DRAFT" && projectDetail.discovery?.status === "COMPLETED") ? (
            <CheckCircle2 className="size-10 text-emerald-400 shrink-0 animate-fadeIn" />
          ) : (
            <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
