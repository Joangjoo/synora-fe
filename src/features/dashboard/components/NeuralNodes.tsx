"use client";

import React from "react";
import { Cpu } from "lucide-react";

export function NeuralNodes() {
  const nodes = [
    {
      name: "Architect-01",
      role: "Arsitek AI",
      load: "45%",
      status: "Active",
      statusColor: "bg-purple-500",
    },
    {
      name: "Engineer-02",
      role: "Software Engineer",
      load: "82%",
      status: "Active",
      statusColor: "bg-purple-500",
    },
    {
      name: "Writer-01",
      role: "Penulis Teknis",
      load: "12%",
      status: "Active",
      statusColor: "bg-purple-500",
    },
    {
      name: "QA-02",
      role: "Penjamin Mutu (QA)",
      load: "95%",
      status: "Active",
      statusColor: "bg-purple-500",
    },
  ];

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <Cpu size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Node Neural Aktif
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Beban kerja agen otonom yang ditugaskan
            </span>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 pt-3 items-center">
        {nodes.map((node) => (
          <div
            key={node.name}
            className="border border-[#27272A] rounded-xl p-2 bg-[#111113] flex items-center justify-between gap-1 group hover:border-purple-500/25 transition-all"
          >
            <div className="text-left min-w-0">
              <span className="text-[10px] font-bold text-foreground block truncate">
                {node.name}
              </span>
              <span className="text-[8px] text-muted-foreground/60 block truncate">
                {node.role}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] font-mono text-purple-400 font-bold block">
                {node.load}
              </span>
              <span className="text-[7px] text-muted-foreground/40 block leading-none mt-0.5">
                Beban
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
