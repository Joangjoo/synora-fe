"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2, User, Search, Mail, Building, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatRelativeTime } from "@/lib/utils";

interface ClientSummary {
  client_name: string;
  client_email: string;
  project_count: number;
  last_project_date: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (error) {
      toast.error("Gagal memuat daftar klien.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <User className="text-purple-500" />
            Daftar Klien
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Pantau dan kelola database klien yang telah menggunakan layanan SYNORA.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama klien atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#111113] border border-[#27272A] text-sm text-foreground focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
            <p className="text-zinc-500">Memuat data klien...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-800">
              <User className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-300 mb-2">Tidak ada klien ditemukan</h3>
            <p className="text-zinc-500 text-sm max-w-sm">
              {searchQuery 
                ? "Cobalah menggunakan kata kunci pencarian yang berbeda."
                : "Database klien masih kosong. Buat proyek baru untuk menambahkan klien."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#18181B] border-b border-[#27272A] text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Klien</th>
                  <th className="px-6 py-4">Kontak (Email)</th>
                  <th className="px-6 py-4">Total Proyek</th>
                  <th className="px-6 py-4">Aktivitas Terakhir</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-[#18181B]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {client.client_name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-100">{client.client_name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                            <Building className="w-3 h-3" />
                            <span>Client Partner</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`mailto:${client.client_email}`} className="hover:text-purple-400 transition-colors">
                          {client.client_email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300">
                        {client.project_count} Proyek
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {client.last_project_date ? formatRelativeTime(client.last_project_date) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(client.client_email);
                          toast.success("Email klien disalin ke clipboard");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded border border-[#27272A] hover:bg-[#27272A] text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        Salin Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
