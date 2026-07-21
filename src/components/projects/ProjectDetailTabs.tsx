"use client";

import React, { useState } from "react";
import { 
  Folder, 
  Cpu, 
  Layers, 
  FileText, 
  Activity as ActivityIcon, 
  Sparkles, 
  Clock, 
  Server, 
  Database, 
  ShieldCheck, 
  BookOpen, 
  CloudLightning,
  Eye,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { ProjectDetailResponse, Artifact } from "@/types/project";

interface ProjectDetailTabsProps {
  projectDetail: ProjectDetailResponse;
  onSendBRD?: (id: string) => void;
  onSendFinalDocs?: (id: string) => void;
}

export function ProjectDetailTabs({
  projectDetail,
  onSendBRD,
  onSendFinalDocs
}: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "discovery" | "pipeline" | "artifacts" | "activity">("overview");
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);

  const artifacts = projectDetail.artifacts || [];

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

  const handleDownloadMarkdown = (art: Artifact) => {
    const blob = new Blob([art.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${art.stage_key}.md`;
    a.click();
    toast.success("Dokumen diunduh");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#27272A] gap-8 mb-4">
        {(
          [
            { id: "overview", title: "Ringkasan", icon: Folder },
            { id: "discovery", title: "Discovery Summary", icon: Cpu },
            { id: "pipeline", title: "Pipeline Produksi", icon: Layers },
            { id: "artifacts", title: "Hasil Dokumen AI", icon: FileText },
            { id: "activity", title: "Log Aktivitas", icon: ActivityIcon }
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3.5 text-sm font-bold transition-all relative cursor-pointer outline-none border-none bg-transparent flex items-center gap-2 ${
                activeTab === t.id ? "text-purple-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={15} />
              {t.title}
              {activeTab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px] w-full text-left">
        {activeTab === "overview" && (
          /* TAB: OVERVIEW */
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
                  <div className="p-4 bg-[#111113] border border-[#27272A] rounded-xl">
                    <span className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">Tahap Aktif</span>
                    <p className="text-foreground text-base font-bold mt-1 uppercase font-mono tracking-wide">
                      {projectDetail.project.status === "COMPLETED" ? "SELESAI" : "PRODUKSI AI"}
                    </p>
                  </div>
                  <div className="p-4 bg-[#111113] border border-[#27272A] rounded-xl">
                    <span className="text-xs text-muted-foreground/60 uppercase font-bold tracking-wider">Total Dokumen Rilis</span>
                    <p className="text-purple-400 text-base font-bold mt-1 font-mono">
                      {artifacts.length} / 9 Dokumen
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl col-span-2 md:col-span-1 border ${
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
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Catatan Klien:</span>
                        <p className="text-xs text-red-300 leading-relaxed whitespace-pre-wrap">
                          {projectDetail.project.approval_note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
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
        )}

        {activeTab === "discovery" && (
          /* TAB: DISCOVERY SUMMARY */
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
        )}

        {activeTab === "pipeline" && (
          /* TAB: PIPELINE */
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
                        <div className="flex items-center justify-between">
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
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono font-medium">
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
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground border-b border-[#27272A] pb-3">Status Kinerja Tim AI</h3>
                <div className="space-y-4">
                  {projectDetail.pipeline.map((stage) => {
                    if (stage.status !== "IN_PROGRESS") return null;
                    return (
                      <div key={stage.production_stage_id} className="p-5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-2">
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
        )}

        {activeTab === "artifacts" && (
          /* TAB: ARTIFACTS */
          <div className="animate-fadeIn space-y-6">
            {/* Header / Actions for Artifacts */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#18181B] border border-[#27272A] p-4 rounded-xl">
              <div>
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
        )}

        {activeTab === "activity" && (
          /* TAB: ACTIVITY LOGS */
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
                    <div className="flex items-start justify-between gap-2">
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
        )}
      </div>
    </div>
  );
}
