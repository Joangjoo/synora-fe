"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetailResponse, Artifact } from "@/types/project";
import api from "@/lib/api";
import axios from "axios";
import { 
  Loader2, 
  FileText, 
  Activity, 
  AlertCircle,
  Download
} from "lucide-react";
import { toast } from "sonner";

// Import subkomponen hasil modularisasi
import { ClientHeader } from "./_components/ClientHeader";
import { ClientStatusBanner } from "./_components/ClientStatusBanner";
import { BrdTab } from "./_components/BrdTab";
import { PipelineTab } from "./_components/PipelineTab";
import { ArtifactsTab } from "./_components/ArtifactsTab";
import { ArtifactPreviewModal } from "./_components/ArtifactPreviewModal";

export default function ClientPublicPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("brd");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/client/${token}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data proyek atau token tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        fetchData();
      }, 0);
    }
    const interval = setInterval(() => {
      if (data?.project.approval_status === "APPROVED" && data?.project.status !== "COMPLETED") {
        fetchData();
      }
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, data?.project.status, data?.project.approval_status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-zinc-400">Memuat detail proyek...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Proyek Tidak Ditemukan</h2>
        <p className="text-zinc-400">Link yang Anda gunakan mungkin salah atau sudah kedaluwarsa.</p>
      </div>
    );
  }

  const { project, pipeline, artifacts, discovery } = data;
  const brdSummary = discovery?.ai_summary || "BRD belum tersedia.";

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await api.post(`/client/${token}/approve`);
      toast.success("BRD berhasil disetujui! Tim AI kami mulai bekerja.");
      fetchData();
    } catch (err) {
      let errorMsg = "Gagal menyetujui BRD.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevise = async (note: string) => {
    try {
      setIsSubmitting(true);
      await api.post(`/client/${token}/revise`, { note });
      toast.success("Permintaan revisi berhasil dikirim ke tim kami.");
      fetchData();
    } catch (err) {
      let errorMsg = "Gagal mengirim revisi.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-50 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <ClientHeader projectName={project.project_name} />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Welcome & Approval Status */}
        <ClientStatusBanner
          project={project}
          isSubmitting={isSubmitting}
          onApprove={handleApprove}
          onRevise={handleRevise}
        />

        {/* Custom Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-[#27272A] mb-8 pb-px">
          {[
            { id: "brd", label: "Review BRD", icon: FileText },
            { id: "pipeline", label: "Pipeline Progress", icon: Activity },
            { id: "artifacts", label: "Dokumen Hasil", icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[50vh]">
          {activeTab === "brd" && <BrdTab summary={brdSummary} />}
          {activeTab === "pipeline" && (
            <PipelineTab 
              pipeline={pipeline} 
              isApproved={project.approval_status === "APPROVED"} 
            />
          )}
          {activeTab === "artifacts" && (
            <ArtifactsTab 
              artifacts={artifacts} 
              onPreview={setPreviewArtifact} 
            />
          )}
        </div>
      </main>

      {/* Modal Preview Dokumen */}
      {previewArtifact && (
        <ArtifactPreviewModal
          artifact={previewArtifact}
          onClose={() => setPreviewArtifact(null)}
        />
      )}
    </div>
  );
}
