import React from "react";
import { Artifact } from "@/types/project";
import { Download, Eye } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ArtifactsTabProps {
  artifacts: Artifact[];
  onPreview: (artifact: Artifact) => void;
}

export function ArtifactsTab({ artifacts, onPreview }: ArtifactsTabProps) {
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
              
              <div className="flex gap-2.5">
                <button 
                  onClick={() => onPreview(artifact)}
                  className="flex-1 h-9 rounded-lg bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-600 flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer outline-none"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Pratinjau
                </button>
                <button 
                  onClick={() => downloadFile(artifact.content, `${artifact.title.replace(/\s+/g, '_')}.md`)}
                  className="flex-1 h-9 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer outline-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
