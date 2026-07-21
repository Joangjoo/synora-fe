"use client";

import React from "react";
import { Sparkles, FileText, Download, Eye } from "lucide-react";
import { ProjectDetailResponse, Artifact } from "@/types/project";

interface ArtifactsTabProps {
  projectDetail: ProjectDetailResponse;
  artifacts: Artifact[];
  previewArtifact: Artifact | null;
  setPreviewArtifact: (art: Artifact | null) => void;
  onSendFinalDocs?: (id: string) => void;
  handleDownloadMarkdown: (art: Artifact) => void;
}

export function ArtifactsTab({
  projectDetail,
  artifacts,
  previewArtifact,
  setPreviewArtifact,
  onSendFinalDocs,
  handleDownloadMarkdown,
}: ArtifactsTabProps) {
  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header / Actions for Artifacts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#18181B] border border-[#27272A] p-4 rounded-xl">
        <div className="text-left">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
            Gudang Dokumen Hasil Produksi AI
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Semua dokumen akan terkumpul otomatis di sini seiring berjalannya pipeline.
          </p>
        </div>
        
        {projectDetail.project.status === "COMPLETED" && (
          <button
            onClick={() => onSendFinalDocs && onSendFinalDocs(projectDetail.project.id)}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-600/20 border-none outline-none cursor-pointer transition-colors uppercase tracking-wider shrink-0"
          >
            <Sparkles size={14} /> Kirim Notifikasi ke Klien
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-2">
          <div className="p-4 bg-[#111113] border border-[#27272A] rounded-xl mb-2 text-left">
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider block">Dokumen Dirilis</span>
            <span className="text-base font-extrabold text-foreground">{artifacts.length} Tersedia</span>
          </div>

          {artifacts.length === 0 ? (
            <div className="text-xs text-muted-foreground/45 p-4 text-center">Belum ada dokumen rilis.</div>
          ) : (
            artifacts.map((art) => (
              <button
                key={art.id}
                onClick={() => setPreviewArtifact(art)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-xs md:text-sm font-bold text-left transition-all border-none ${
                  previewArtifact?.id === art.id 
                    ? "bg-purple-600 text-white" 
                    : "bg-[#18181B] border border-[#27272A] text-muted-foreground hover:text-foreground hover:bg-[#1f1f23] cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={14} className={previewArtifact?.id === art.id ? "text-white" : "text-purple-400"} />
                  <span className="truncate">{art.title}</span>
                </div>
                <span className="text-[10px] font-mono opacity-60">v{art.version}</span>
              </button>
            ))
          )}
        </div>

        {/* Preview window */}
        <div className="md:col-span-3 bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-left flex flex-col justify-between h-[500px]">
          {previewArtifact ? (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                      {previewArtifact.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground/60 block font-mono mt-0.5">Kode Dokumen: {previewArtifact.stage_key}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadMarkdown(previewArtifact)}
                      className="h-9 px-4 rounded-lg bg-[#111113] border border-[#27272A] text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Download size={12} /> Unduh MD
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-[#111113] p-4 rounded-xl border border-[#27272A] text-sm leading-relaxed text-muted-foreground/90 font-mono whitespace-pre-wrap scrollbar-thin">
                  {previewArtifact.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground/60 select-none">
              <Eye size={44} className="text-muted-foreground/15" />
              <p className="text-sm font-bold text-foreground">Pilih Dokumen untuk Pratinjau</p>
              <p className="text-xs text-muted-foreground/50 max-w-xs leading-relaxed">
                Klik salah satu daftar dokumen di sebelah kiri untuk menampilkan isi berkas secara real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
