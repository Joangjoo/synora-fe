"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, UploadCloud, Trash2 } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    clientName: string,
    clientEmail: string,
    designImages: string,
    designNote: string,
  ) => Promise<void>;
  isCreating: boolean;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [designNote, setDesignNote] = useState("");
  const [images, setImages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim() || !clientEmail.trim()) return;

    // Serialize images as a JSON string
    const imagesPayload = images.length > 0 ? JSON.stringify(images) : "";
    await onCreate(name, clientName, clientEmail, imagesPayload, designNote);
    
    // Reset state
    setName("");
    setClientName("");
    setClientEmail("");
    setDesignNote("");
    setImages([]);
  };

  const handleCancel = () => {
    setName("");
    setClientName("");
    setClientEmail("");
    setDesignNote("");
    setImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn select-none">
      <div className="bg-[#18181B] border border-[#27272A] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#111113] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
              <Sparkles size={14} />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-foreground">
              Inisiasi Proyek Baru
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-left overflow-y-auto max-h-[75vh]">
          {/* Client Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Nama Klien
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Klien..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Client Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Email Klien (Untuk BRD)
            </label>
            <input
              type="email"
              placeholder="Masukkan Email Klien..."
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Nama Proyek
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Proyek..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Design Reference Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Referensi Desain (Opsional)
            </label>
            <textarea
              placeholder="Jelaskan preferensi tampilan, skema warna, layout, atau fitur desain spesifik yang Anda inginkan..."
              value={designNote}
              onChange={(e) => setDesignNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-[#111113] border border-[#27272A] p-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          {/* Reference Image Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Foto Referensi Desain (Maksimal 4)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-[#27272A] group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt="Preview referensi"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer outline-none border-none"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="aspect-video rounded-xl border border-dashed border-[#27272A] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <UploadCloud size={16} className="text-muted-foreground/60" />
                  <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wide">
                    Pilih Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Notice */}
          <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 size={20} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
              Tuliskan nama sistem yang ingin Anda buat. Seluruh informasi kebutuhan dan spesifikasi detail akan digali secara interaktif oleh Business Analyst AI pada sesi berikutnya.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#27272A]/70 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="h-10 px-4 rounded-xl border border-[#27272A] hover:bg-[#111113] text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer outline-none bg-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim() || !clientName.trim() || !clientEmail.trim()}
              className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-colors cursor-pointer outline-none border-none"
            >
              {isCreating ? "Menyimpan..." : "Lanjutkan"}
              <Sparkles size={12} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
