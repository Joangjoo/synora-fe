"use client";

import React, { useState } from "react";
import { Folder, Plus, Search, Cpu, ChevronRight, Trash2 } from "lucide-react";
import { BackendProject } from "@/types/project"; // If needed, but let's just assume any interface in types/project

interface ProjectListProps {
  projects: BackendProject[];
  onOpenCreateModal: () => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectList({ projects, onOpenCreateModal, onSelectProject, onDeleteProject }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects?.filter((p) =>
    p.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "SUBMITTED": return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "IN_PROGRESS": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "COMPLETED": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      default: return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    }
  };

  const getStatusIndonesian = (status: string) => {
    switch (status) {
      case "DRAFT": return "Penelusuran AI";
      case "SUBMITTED": return "Menunggu Review";
      case "IN_PROGRESS": return "Produksi AI";
      case "COMPLETED": return "Selesai";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full select-none text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/60 leading-none mb-2">
            <span>Synora Ai</span>
            <span>/</span>
            <span className="text-purple-400 font-bold">Proyek</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-foreground">
            Daftar Proyek
          </h1>
          <p className="text-base text-muted-foreground mt-2 font-medium leading-relaxed">
            Kelola, buat, dan pantau perkembangan proyek otonom secara real-time.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCreateModal}
          className="h-14 px-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center gap-2.5 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all cursor-pointer shrink-0 border-none outline-none"
        >
          <Plus size={18} />
          Proyek Baru
        </button>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/50">
          <Search size={20} />
        </span>
        <input
          type="text"
          placeholder="Cari nama proyek..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 rounded-xl bg-[#18181B] border border-[#27272A] pl-14 pr-5 text-base text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects?.length === 0 ? (
        <div className="w-full py-20 border border-[#27272A] border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 text-center bg-[#111113]/30">
          <div className="p-4 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-400">
            <Folder size={28} />
          </div>
          <div>
            <p className="text-base font-black text-foreground">Tidak Ada Proyek Ditemukan</p>
            <p className="text-sm text-muted-foreground/60 mt-1 font-medium">
              Mulai dengan membuat proyek baru Anda pertama kali.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects?.map((project) => (
            <div
              key={project.id}
              className="bg-[#18181B] border border-[#27272A] rounded-2xl p-7 hover:border-purple-500/30 transition-all flex flex-col justify-between h-[340px] relative group overflow-hidden"
            >
              <div className="space-y-4 text-left">
                {/* Top Row: Client Badge & Stage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-black tracking-widest uppercase border px-3 py-1 rounded ${getStatusColor(project.status)}`}>
                      {getStatusIndonesian(project.status)}
                    </span>
                    {project.approval_status === "REVISION" && (
                      <span className="text-xs font-black tracking-widest uppercase bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1 rounded flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Revisi BRD
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground/65 font-mono">
                    {new Date(project.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xl font-black text-foreground group-hover:text-purple-400 transition-colors truncate">
                    {project.project_name}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 mt-2 line-clamp-3 leading-relaxed font-medium">
                    Proyek otonom dengan model AI terpilih untuk membangun spesifikasi dan kode sumber lengkap.
                  </p>
                </div>
              </div>

              {/* Bottom Area: Progress & Actions */}
              <div className="space-y-5 pt-5 border-t border-[#27272A]/70 mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground/75">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-purple-400" />
                    <span>SYNORA AI Agent Core</span>
                  </div>
                  
                  <span className="text-muted-foreground/50 font-mono">
                    ID: <strong className="text-purple-400 font-black">{project.id.substring(0, 8)}</strong>
                  </span>
                </div>

                {/* Hover Overlay Actions */}
                <div
                  className="absolute inset-0 bg-[#09090B]/90 border border-purple-500/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300 backdrop-blur-xs rounded-2xl p-5"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.id);
                    }}
                    className="h-12 px-6 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all border-none outline-none cursor-pointer"
                  >
                    <span>Buka Detail</span>
                    <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="h-12 px-6 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black text-sm rounded-xl flex items-center gap-2 border border-red-500/20 hover:border-red-600 transition-all outline-none cursor-pointer"
                  >
                    <Trash2 size={18} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
