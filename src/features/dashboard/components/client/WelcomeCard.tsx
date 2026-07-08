"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function WelcomeCard() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Klien";

  return (
    <div className="w-full relative overflow-hidden bg-linear-to-r from-purple-900/30 via-purple-950/10 to-zinc-950 border border-purple-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Greeting details */}
      <div className="flex-1 text-center md:text-left space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[10px] font-extrabold uppercase tracking-wider">
          <Sparkles size={10} />
          Sistem Operasional Aktif
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
          Selamat datang kembali, <span className="text-purple-400">{firstName}</span>!
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Siap untuk meluncurkan proyek berbasis AI berikutnya? Agen otonom kami siap membantu Anda melakukan penelusuran, merancang arsitektur, dan menyusun seluruh kebutuhan perangkat lunak Anda dengan presisi.
        </p>
      </div>

      {/* Button Action */}
      <div className="shrink-0 z-10">
        <button className="h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all cursor-pointer">
          Jelajahi Karyawan AI
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
