"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  projectName: string;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  projectName,
}: DeleteProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#111113] flex items-center justify-between border-none">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500">
              <AlertTriangle size={14} />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Konfirmasi Hapus Proyek
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4 text-left">
          <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
            Apakah Anda yakin ingin menghapus proyek <strong className="text-foreground font-bold">&quot;{projectName}&quot;</strong>? Tindakan ini akan menghapus seluruh rekaman aktivitas dan dokumen pipeline AI yang bersangkutan secara permanen.
          </p>

          {/* Modal Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#27272A]/70 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="h-10 px-4 rounded-xl border border-[#27272A] hover:bg-[#111113] text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer outline-none bg-transparent"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-colors cursor-pointer outline-none border-none"
            >
              {isDeleting ? "Menghapus..." : "Hapus Permanen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
