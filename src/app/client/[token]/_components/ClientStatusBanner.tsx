import React, { useState } from "react";
import { BackendProject } from "@/types/project";
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Send 
} from "lucide-react";

interface ClientStatusBannerProps {
  project: BackendProject;
  isSubmitting: boolean;
  onApprove: () => Promise<void>;
  onRevise: (note: string) => Promise<void>;
}

export function ClientStatusBanner({ 
  project, 
  isSubmitting, 
  onApprove, 
  onRevise 
}: ClientStatusBannerProps) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const handleReviseSubmit = async () => {
    if (!revisionNote.trim()) return;
    await onRevise(revisionNote);
    setShowRevisionForm(false);
    setRevisionNote("");
  };

  return (
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
                  onClick={onApprove}
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
                onClick={handleReviseSubmit}
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
  );
}
