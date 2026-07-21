import React from "react";

interface ClientHeaderProps {
  projectName: string;
}

export function ClientHeader({ projectName }: ClientHeaderProps) {
  return (
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
          Proyek: <span className="text-zinc-100">{projectName}</span>
        </div>
      </div>
    </header>
  );
}
