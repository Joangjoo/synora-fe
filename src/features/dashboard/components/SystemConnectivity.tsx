"use client";

import React from "react";
import { Network } from "lucide-react";

export function SystemConnectivity() {
  const connections = [
    { provider: "Claude 3.5 Sonnet", latency: "0.8s", status: "Operasional" },
    { provider: "GPT-4o Engine", latency: "1.1s", status: "Operasional" },
    { provider: "Gemini 1.5 Pro", latency: "1.5s", status: "Operasional" },
  ];

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Network size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Konektivitas Sistem
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Status latensi penyedia API LLM pihak luar
            </span>
          </div>
        </div>
      </div>

      {/* Connectivity List */}
      <div className="space-y-2 flex-1 pt-3 flex flex-col justify-center">
        {connections.map((conn) => (
          <div
            key={conn.provider}
            className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#111113] border border-[#27272A] hover:border-purple-500/15 transition-all text-xs"
          >
            <div className="flex items-center gap-2 text-left min-w-0">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-foreground truncate max-w-[120px]">
                {conn.provider}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[9px] font-mono text-purple-400 font-bold">
                {conn.latency}
              </span>
              <span className="text-[8px] font-bold text-muted-foreground/60">
                {conn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
