"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2, Bot, Settings2, Save, X, Server, BrainCircuit, Activity } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface AIEmployee {
  id: string;
  display_name: string;
  role: string;
  provider: string;
  model: string;
  description: string;
  system_prompt: string;
  temperature: number;
  max_output_tokens: number;
  is_active: boolean;
}

export default function AITeamPage() {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState<Partial<AIEmployee>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ai-employees");
      setEmployees(res.data);
    } catch (error) {
      toast.error("Gagal memuat tim AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchEmployees();
    }, 0);
  }, []);

  const handleEditClick = (employee: AIEmployee) => {
    setEditingId(employee.id);
    setEditForm({
      provider: employee.provider,
      model: employee.model,
      system_prompt: employee.system_prompt,
      temperature: employee.temperature,
      max_output_tokens: employee.max_output_tokens,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      setIsSaving(true);
      await api.put(`/ai-employees/${id}`, editForm);
      toast.success("Konfigurasi AI berhasil diperbarui.");
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      toast.error("Gagal menyimpan konfigurasi.");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "BUSINESS_ANALYST": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "PRODUCT_MANAGER": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "SYSTEM_ARCHITECT": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "DATABASE_ENGINEER": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "BACKEND_ENGINEER": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "FRONTEND_ENGINEER": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "QA_ENGINEER": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Bot className="text-purple-500" />
            Tim AI (Agen Pekerja)
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Atur konfigurasi LLM, System Prompt, dan parameter untuk setiap peran AI di dalam pipeline produksi.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
          <p className="text-zinc-500">Memuat konfigurasi AI...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col transition-all hover:border-purple-500/30 group">
              <div className="p-5 border-b border-[#27272A] flex justify-between items-start">
                <div>
                  <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mb-3 border ${getRoleColor(emp.role)}`}>
                    {emp.role.replace("_", " ")}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">{emp.display_name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{emp.description}</p>
                </div>
                
                {editingId !== emp.id && (
                  <button 
                    onClick={() => handleEditClick(emp)}
                    className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                    title="Edit Konfigurasi"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editingId === emp.id ? (
                <div className="p-5 bg-[#18181B] flex-1 flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Provider (GROQ / OPENROUTER / GEMINI)</label>
                    <select 
                      value={editForm.provider}
                      onChange={(e) => setEditForm({...editForm, provider: e.target.value})}
                      className="w-full h-10 rounded-lg bg-[#111113] border border-[#27272A] px-3 text-xs text-foreground outline-none focus:border-purple-500/50"
                    >
                      <option value="GROQ">Groq (Llama)</option>
                      <option value="OPENROUTER">OpenRouter</option>
                      <option value="GEMINI">Google Gemini</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Model LLM</label>
                    <input 
                      type="text"
                      value={editForm.model}
                      onChange={(e) => setEditForm({...editForm, model: e.target.value})}
                      className="w-full h-10 rounded-lg bg-[#111113] border border-[#27272A] px-3 text-xs text-foreground outline-none focus:border-purple-500/50"
                      placeholder="e.g. llama-3.3-70b-versatile"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Temperature</label>
                      <input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={editForm.temperature}
                        onChange={(e) => setEditForm({...editForm, temperature: parseFloat(e.target.value)})}
                        className="w-full h-10 rounded-lg bg-[#111113] border border-[#27272A] px-3 text-xs text-foreground outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Max Tokens</label>
                      <input 
                        type="number"
                        step="100"
                        value={editForm.max_output_tokens}
                        onChange={(e) => setEditForm({...editForm, max_output_tokens: parseInt(e.target.value)})}
                        className="w-full h-10 rounded-lg bg-[#111113] border border-[#27272A] px-3 text-xs text-foreground outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">System Prompt (Instruksi Utama)</label>
                    <textarea 
                      value={editForm.system_prompt}
                      onChange={(e) => setEditForm({...editForm, system_prompt: e.target.value})}
                      className="w-full h-32 rounded-lg bg-[#111113] border border-[#27272A] p-3 text-xs text-foreground outline-none focus:border-purple-500/50 resize-none font-mono"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#27272A] hover:bg-[#27272A] text-zinc-300 transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Batal
                    </button>
                    <button 
                      onClick={() => handleSave(emp.id)}
                      disabled={isSaving}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-black/20 border border-[#27272A]/50">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Server className="w-4 h-4 text-zinc-500" /> Provider
                    </div>
                    <span className="font-semibold text-zinc-200">{emp.provider}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-black/20 border border-[#27272A]/50">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <BrainCircuit className="w-4 h-4 text-zinc-500" /> Model
                    </div>
                    <span className="font-semibold text-zinc-200 truncate max-w-[120px]" title={emp.model}>{emp.model}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-black/20 border border-[#27272A]/50 text-center">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Temperature</span>
                      <span className="text-sm font-semibold text-zinc-200">{emp.temperature}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-black/20 border border-[#27272A]/50 text-center">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Max Tokens</span>
                      <span className="text-sm font-semibold text-zinc-200">{emp.max_output_tokens}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity className="w-3 h-3" /> Status
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-400 font-medium">Online & Ready</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
