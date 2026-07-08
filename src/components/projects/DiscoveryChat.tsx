"use client";

import React from "react";
import { Send, FileText, AlertCircle, Sparkles } from "lucide-react";
import { ProjectDetailResponse, ChatAnswer } from "@/types/project";

interface DiscoveryChatProps {
  projectDetail: ProjectDetailResponse;
  chatMessages: ChatAnswer[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingMessage: boolean;
  isSubmittingProject: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onSubmitForReview: () => void;
}

export function DiscoveryChat({
  projectDetail,
  chatMessages,
  chatInput,
  setChatInput,
  isSendingMessage,
  isSubmittingProject,
  onSendMessage,
  onSubmitForReview,
}: DiscoveryChatProps) {
  let designImagesList: string[] = [];
  if (projectDetail.project.design_images) {
    try {
      designImagesList = JSON.parse(projectDetail.project.design_images);
    } catch (e) {
      console.error("Failed to parse design images", e);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Column */}
      <div className="lg:col-span-2 bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[520px] text-left">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-[#27272A]/70 pb-3.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
            BA
          </div>
          {/* BA Details */}
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Business Analyst AI
            </h3>
            <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded block mt-0.5 w-fit uppercase tracking-wider">
              Discovery Agent
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 scrollbar-thin">
          {chatMessages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${
                msg.sender === "USER" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                  msg.sender === "USER"
                    ? "bg-purple-600 text-white rounded-tr-none text-left"
                    : "bg-[#111113] border border-[#27272A] text-muted-foreground rounded-tl-none text-left whitespace-pre-line"
                }`}
              >
                {msg.message}
                <span className="block text-[8px] text-muted-foreground/45 mt-1.5 font-mono">
                  {new Date(msg.created_at).toLocaleTimeString("id-ID")}
                </span>
              </div>
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto">
              <div className="bg-[#111113] border border-[#27272A] text-muted-foreground/60 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                <div className="size-3 border border-purple-500/30 border-t-purple-500 animate-spin rounded-full" />
                <span>Menganalisis kebutuhan...</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Input */}
        {projectDetail.discovery?.status !== "COMPLETED" ? (
          <form
            onSubmit={onSendMessage}
            className="flex gap-2.5 border-t border-[#27272A]/70 pt-3.5 mt-2.5"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ketik balasan Anda mengenai kebutuhan bisnis..."
              disabled={isSendingMessage}
              className="flex-1 h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSendingMessage || !chatInput.trim()}
              className="size-11 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            >
              <Send size={14} />
            </button>
          </form>
        ) : (
          <div className="border-t border-[#27272A]/70 pt-3.5 mt-2.5 flex flex-col gap-2">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-400 font-semibold">
              ✔ Wawancara Discovery AI Selesai. Silakan tinjau ringkasan di
              samping dan kirim proyek Anda.
            </div>
          </div>
        )}
      </div>

      {/* Summary Column */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[520px] text-left">
        <div className="flex items-center gap-2 border-b border-[#27272A]/70 pb-3 mb-3">
          <FileText size={14} className="text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
            Discovery Summary
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#111113] p-4 rounded-xl border border-[#27272A] mb-3 text-xs leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-mono scrollbar-thin">
          {projectDetail.discovery?.ai_summary ? (
            projectDetail.discovery.ai_summary
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-full text-center text-muted-foreground/40 select-none">
              <AlertCircle size={28} className="text-muted-foreground/10" />
              <p className="text-[10px] font-bold">Ringkasan Belum Dibuat</p>
              <p className="text-[9px] max-w-[180px] leading-relaxed">
                Selesaikan 5 pertanyaan kuesioner agar AI dapat merangkum seluruh
                spesifikasi awal.
              </p>
            </div>
          )}
        </div>

        {/* Design Reference Panel */}
        {(projectDetail.project.design_note || designImagesList.length > 0) && (
          <div className="border-t border-[#27272A]/70 pt-3 mb-3 flex flex-col gap-1.5 shrink-0">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
              Referensi Desain Klien
            </h4>
            {projectDetail.project.design_note && (
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed max-h-[60px] overflow-y-auto bg-[#111113] p-2 rounded-lg border border-[#27272A] scrollbar-thin">
                {projectDetail.project.design_note}
              </p>
            )}
            {designImagesList.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {designImagesList.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden border border-[#27272A]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt="Referensi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {projectDetail.discovery?.status === "COMPLETED" && (
          <button
            onClick={onSubmitForReview}
            disabled={isSubmittingProject}
            className="w-full h-11 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border-none outline-none shadow-lg shadow-purple-600/10 transition-all cursor-pointer shrink-0"
          >
            {isSubmittingProject
              ? "Mengirim Proyek..."
              : "Kirim Proyek ke CEO untuk Review"}
            <Sparkles size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
