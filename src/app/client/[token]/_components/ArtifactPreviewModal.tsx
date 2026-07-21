import React from "react";
import { Artifact } from "@/types/project";
import { XCircle, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArtifactPreviewModalProps {
  artifact: Artifact;
  onClose: () => void;
}

export function ArtifactPreviewModal({ artifact, onClose }: ArtifactPreviewModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#111113] border border-[#27272A] w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#18181B]/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                v{artifact.version}
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {artifact.stage_key}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">{artifact.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#18181B] transition-colors border-none outline-none cursor-pointer"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-a:text-purple-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {artifact.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#27272A] bg-[#18181B]/50">
          <button
            onClick={() => {
              downloadFile(artifact.content, `${artifact.title.replace(/\s+/g, '_')}.md`);
            }}
            className="h-10 px-5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-none outline-none cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Markdown
          </button>
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-zinc-700 hover:bg-[#18181B] text-zinc-300 text-sm font-semibold transition-colors border-none outline-none cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
