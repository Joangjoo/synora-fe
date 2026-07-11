"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetailResponse } from "@/types/project";
import api from "@/lib/api";
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Activity, 
  AlertCircle,
  Download,
  Send,
  RefreshCw,
  XCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";

export default function ClientPublicPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("brd");
  const [revisionNote, setRevisionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

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
    if (token) fetchData();
    
    // Simple polling if pipeline is running
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
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyetujui BRD.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevise = async () => {
    if (!revisionNote.trim()) {
      toast.error("Catatan revisi tidak boleh kosong.");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post(`/client/${token}/revise`, { note: revisionNote });
      toast.success("Permintaan revisi berhasil dikirim ke tim kami.");
      setShowRevisionForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal mengirim revisi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-50 font-sans selection:bg-purple-500/30">
      {/* Header Minimalist */}
      <header className="border-b border-[#27272A] bg-[#111113] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xl tracking-tight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SYNORA
          </div>
          <div className="text-sm text-zinc-400 font-medium">
            Proyek: <span className="text-zinc-100">{project.project_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Welcome & Approval Status */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Halo, {project.client_name}</h1>
          <p className="text-zinc-400">Selamat datang di portal klien SYNORA. Di sini Anda dapat meninjau kebutuhan sistem dan melacak progres pengerjaan.</p>
          
          {/* Status Alert Banner */}
          <div className="mt-6">
            {project.approval_status === "SENT" && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-purple-100 mb-1">Menunggu Persetujuan Anda</h3>
                    <p className="text-sm text-purple-200/70">Tinjau Business Requirements Document (BRD) di bawah. Jika sesuai, setujui agar AI kami dapat mulai bekerja.</p>
                  </div>
                </div>
                {!showRevisionForm && (
                  <div className="flex shrink-0 gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => setShowRevisionForm(true)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-sm font-semibold transition-colors"
                    >
                      Minta Revisi
                    </button>
                    <button 
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Setujui BRD
                    </button>
                  </div>
                )}
              </div>
            )}

            {showRevisionForm && (
              <div className="bg-[#18181B] border border-orange-500/30 rounded-xl p-5 mt-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-orange-400">Catatan Revisi BRD</h3>
                  <button onClick={() => setShowRevisionForm(false)} className="text-zinc-500 hover:text-zinc-300">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <textarea 
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Tuliskan bagian mana yang perlu diperbaiki atau ditambahkan..."
                  className="w-full h-32 bg-[#111113] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 mb-4 resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowRevisionForm(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-sm font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleRevise}
                    disabled={isSubmitting || !revisionNote.trim()}
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Kirim Revisi
                  </button>
                </div>
              </div>
            )}

            {project.approval_status === "REVISION" && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <RefreshCw className="text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-orange-400 mb-1">Dalam Proses Revisi</h3>
                    <p className="text-sm text-orange-200/70 mb-3">Tim kami sedang memperbaiki BRD berdasarkan catatan Anda. Kami akan mengirimkan email setelah revisi selesai.</p>
                    <div className="bg-[#111113] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300">
                      <strong>Catatan Anda:</strong><br/>
                      {project.approval_note}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {project.approval_status === "APPROVED" && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-400 mb-1">BRD Disetujui</h3>
                  <p className="text-sm text-emerald-200/70">Terima kasih! Tim AI kami sedang bekerja. Anda dapat memantau progres di tab Pipeline Progress.</p>
                </div>
              </div>
            )}
          </div>
        </div>

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
          {/* TAB: BRD REVIEW */}
          {activeTab === "brd" && (
            <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 md:p-8 animate-in fade-in">
              <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-a:text-purple-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {brdSummary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* TAB: PIPELINE */}
          {activeTab === "pipeline" && (
            <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 md:p-8 animate-in fade-in">
              {project.approval_status !== "APPROVED" ? (
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
                          <h4 className="font-bold text-zinc-100">{stage.stage_name}</h4>
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
                        {stage.status === "IN_PROGRESS" ? "Dikerjakan AI" : stage.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ARTIFACTS */}
          {activeTab === "artifacts" && (
            <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 md:p-8 animate-in fade-in">
              {artifacts?.length === 0 ? (
                <div className="text-center py-12">
                  <Download className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-300 mb-2">Belum Ada Dokumen</h3>
                  <p className="text-zinc-500">Dokumen akan muncul di sini seiring berjalannya AI Pipeline.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {artifacts?.map((artifact) => (
                    <div key={artifact.id} className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            v{artifact.version}
                          </span>
                          <span className="text-xs text-zinc-500">{formatRelativeTime(artifact.created_at)}</span>
                        </div>
                        <h4 className="font-bold text-zinc-100 mb-1 line-clamp-1">{artifact.title}</h4>
                        <p className="text-xs text-zinc-400 uppercase tracking-wide">{artifact.stage_key}</p>
                      </div>
                      <button 
                        onClick={() => downloadFile(artifact.content, `${artifact.title.replace(/\s+/g, '_')}.md`)}
                        className="w-full h-9 rounded-lg border border-zinc-700 hover:bg-zinc-800 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Unduh Markdown
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
