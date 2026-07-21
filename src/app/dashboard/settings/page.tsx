"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings, Key, Bot, Mail, Server, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [isSaving, setIsSaving] = useState(false);

  // Mock State for Settings
  const [settings, setSettings] = useState({
    openai_key: "sk-or-v1-bb137...",
    groq_key: "gsk_rIS6SmC...",
    gemini_key: "AQ.Ab8RN6Ln...",
    smtp_email: "joangjo22@gmail.com",
    smtp_password: "••••••••••••••••",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pengaturan berhasil disimpan.");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Settings className="text-purple-500" />
            Pengaturan Sistem
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Konfigurasikan kunci API, integrasi email, dan preferensi layanan inti platform.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-10 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer border-none outline-none disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : <><CheckCircle2 size={16} /> Simpan Perubahan</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav Settings */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
          {[
            { id: "api-keys", label: "Integrasi API AI", icon: Bot },
            { id: "email", label: "SMTP & Pengiriman", icon: Mail },
            { id: "security", label: "Keamanan (Coming Soon)", icon: ShieldCheck },
            { id: "system", label: "Informasi Server", icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border-none outline-none cursor-pointer ${
                activeTab === tab.id
                  ? "bg-purple-500/10 text-purple-400 font-bold"
                  : "text-zinc-400 hover:bg-[#18181B] hover:text-zinc-200"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Settings */}
        <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-2xl p-6 md:p-8 min-h-[500px]">
          {activeTab === "api-keys" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#27272A] pb-4 mb-6">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Key size={18} className="text-purple-500" />
                  Kredensial API AI (LLM Providers)
                </h2>
                <p className="text-sm text-zinc-400 mt-1">Sistem menggunakan kunci ini untuk memberikan otak pada agen-agen AI Anda.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Groq API Key</label>
                  <input
                    type="password"
                    value={settings.groq_key}
                    onChange={(e) => setSettings({ ...settings, groq_key: e.target.value })}
                    className="w-full h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-zinc-100 font-mono text-sm focus:border-purple-500/50 outline-none transition-colors"
                  />
                  <p className="text-xs text-zinc-500">Provider utama yang direkomendasikan karena kecepatan Llama 3 yang super tinggi.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={settings.gemini_key}
                    onChange={(e) => setSettings({ ...settings, gemini_key: e.target.value })}
                    className="w-full h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-zinc-100 font-mono text-sm focus:border-purple-500/50 outline-none transition-colors"
                  />
                  <p className="text-xs text-zinc-500">Digunakan sebagai cadangan fallback pertama ketika Groq limit/gagal.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">OpenRouter API Key</label>
                  <input
                    type="password"
                    value={settings.openai_key}
                    onChange={(e) => setSettings({ ...settings, openai_key: e.target.value })}
                    className="w-full h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-zinc-100 font-mono text-sm focus:border-purple-500/50 outline-none transition-colors"
                  />
                  <p className="text-xs text-zinc-500">Digunakan sebagai fallback terakhir untuk mengakses model open-source premium lainnya.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#27272A] pb-4 mb-6">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" />
                  Konfigurasi Email Pengirim
                </h2>
                <p className="text-sm text-zinc-400 mt-1">Mengatur bagaimana sistem mengirimkan dokumen BRD dan notifikasi ke Klien Anda.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">SMTP Email Address</label>
                  <input
                    type="email"
                    value={settings.smtp_email}
                    onChange={(e) => setSettings({ ...settings, smtp_email: e.target.value })}
                    className="w-full h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-zinc-100 text-sm focus:border-purple-500/50 outline-none transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">SMTP App Password</label>
                  <input
                    type="password"
                    value={settings.smtp_password}
                    onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                    className="w-full h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-zinc-100 font-mono text-sm focus:border-purple-500/50 outline-none transition-colors"
                  />
                  <p className="text-xs text-zinc-500">Gunakan App Password dari Google Security (16 digit tanpa spasi).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-800">
                <ShieldCheck className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-2">Keamanan Platform (Segera Hadir)</h3>
              <p className="text-zinc-500 text-sm max-w-sm">
                Pengaturan 2-Factor Authentication (2FA), log IP login, dan manajemen perangkat aktif akan segera ditambahkan di update berikutnya.
              </p>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#27272A] pb-4 mb-6">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Server size={18} className="text-emerald-500" />
                  Informasi Lingkungan Server
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl">
                  <span className="text-xs text-zinc-500 block mb-1">Versi Synora</span>
                  <span className="text-sm font-bold text-zinc-200">v2.1.0 Enterprise</span>
                </div>
                <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl">
                  <span className="text-xs text-zinc-500 block mb-1">Status Database</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-bold text-emerald-400">Terhubung</span>
                  </div>
                </div>
                <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl">
                  <span className="text-xs text-zinc-500 block mb-1">Framework Backend</span>
                  <span className="text-sm font-bold text-zinc-200">Go 1.26.2 (Fiber)</span>
                </div>
                <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl">
                  <span className="text-xs text-zinc-500 block mb-1">Framework Frontend</span>
                  <span className="text-sm font-bold text-zinc-200">Next.js 16 (App Router)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
