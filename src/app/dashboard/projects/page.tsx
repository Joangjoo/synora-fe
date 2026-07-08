"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useProjectStore, Project } from "@/stores/project.store";
import { 
  Folder, 
  Plus, 
  Search, 
  ArrowLeft, 
  FileText, 
  Activity, 
  Cpu, 
  Clock, 
  X, 
  Send,
  ChevronRight,
  Code,
  Layers,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const { projects, addProject } = useProjectStore();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjAgent, setNewProjAgent] = useState("Architect-01");

  // Chat Simulation State
  const [activeTab, setActiveTab] = useState<"docs" | "logs" | "chat">("docs");
  const [activeDocTab, setActiveDocTab] = useState<"BRD" | "ARCHITECTURE" | "CODE">("BRD");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string; time: string }[]>([]);

  useEffect(() => {
    hydrate();
    const timer = setTimeout(() => setIsLoaded(true), 250);
    return () => clearTimeout(timer);
  }, [hydrate]);

  const userRole = user?.role || "CLIENT";
  
  // Filter projects: Clients only see their own projects, CEO/COO see all
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (userRole === "CLIENT") {
      // For demo, client name is "John Klien"
      return matchesSearch && (p.clientId === "client-1" || p.clientName === user?.full_name);
    }
    
    return matchesSearch; // CEO/COO see everything
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjDesc.trim()) {
      toast.error("Formulir tidak lengkap", {
        description: "Harap isi nama dan deskripsi proyek."
      });
      return;
    }

    let agentRole = "Arsitek AI";
    if (newProjAgent === "Engineer-02") agentRole = "Software Engineer";
    if (newProjAgent === "QA-02") agentRole = "Penjamin Mutu (QA)";

    addProject({
      name: newProjName,
      description: newProjDesc,
      aiAgent: newProjAgent,
      aiAgentRole: agentRole,
      clientId: "client-1",
      clientName: user?.full_name || "John Klien",
    });

    toast.success("Proyek Berhasil Dibuat!", {
      description: `Agen AI ${newProjAgent} telah ditugaskan sebagai pemimpin proyek.`
    });

    // Reset Form & Close Modal
    setNewProjName("");
    setNewProjDesc("");
    setNewProjAgent("Architect-01");
    setIsModalOpen(false);
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setActiveTab("docs");
    // Initial chat messages setup
    setChatMessages([
      {
        sender: "ai",
        text: `Halo! Saya ${project.aiAgent} (${project.aiAgentRole}) yang ditugaskan memimpin proyek "${project.name}". Ada yang bisa saya bantu terkait kebutuhan sistem Anda?`,
        time: "Baru saja"
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedProject) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, time: "Baru saja" }]);
    setChatInput("");

    // Simulate AI response delay
    setTimeout(() => {
      let aiResponse = "";
      if (userMsg.toLowerCase().includes("brd") || userMsg.toLowerCase().includes("dokumen")) {
        aiResponse = `Saya sedang mematangkan analisis Dokumen Kebutuhan Bisnis (BRD) untuk proyek "${selectedProject.name}". Anda dapat memeriksa perkembangannya di Tab 'Dokumen AI' di atas.`;
      } else if (userMsg.toLowerCase().includes("status") || userMsg.toLowerCase().includes("progress")) {
        aiResponse = `Saat ini proyek berada dalam tahap ${selectedProject.stage} dengan progress ${selectedProject.progress}%. Semua subsistem berjalan lancar.`;
      } else {
        aiResponse = `Baik, instruksi Anda mengenai "${userMsg}" telah saya catat untuk penyesuaian arsitektur sistem proyek ini. Ada modul spesifik lainnya yang ingin ditambahkan?`;
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiResponse, time: "Baru saja" }]);
    }, 1000);
  };

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 text-left">
          <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          <p className="text-xs text-muted-foreground/60 font-semibold tracking-widest uppercase animate-pulse">
            Sinkronisasi Proyek...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" theme="dark" richColors />
      
      {!selectedProject ? (
        /* ================== LIST VIEW ================== */
        <div className="flex flex-col gap-8 w-full select-none text-left animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60 leading-none mb-1">
                <span>Synora Ai</span>
                <span>/</span>
                <span className="text-purple-400 font-semibold">Proyek Saya</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {userRole === "CLIENT" ? "Proyek Saya" : "Manajemen Proyek Enterprise"}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {userRole === "CLIENT" 
                  ? "Kelola, buat, dan pantau perkembangan proyek software otonom Anda."
                  : "Pantau seluruh proyek klien dan alokasi agen AI otonom secara global."}
              </p>
            </div>

            {/* Action Button - Only for Client Role (or demo toggle) */}
            {userRole === "CLIENT" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all cursor-pointer shrink-0"
              >
                <Plus size={14} />
                Proyek Baru
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Cari nama atau deskripsi proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-xl bg-[#18181B] border border-[#27272A] pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="w-full py-16 border border-[#27272A] border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-center bg-[#111113]/30">
              <div className="p-3 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-400">
                <Folder size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Tidak Ada Proyek Ditemukan</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {userRole === "CLIENT" 
                    ? "Mulai dengan membuat proyek baru Anda pertama kali." 
                    : "Belum ada proyek yang didaftarkan oleh klien."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-[250px] relative group overflow-hidden"
                >
                  <div className="space-y-3 text-left">
                    {/* Top Row: Client Badge & Stage */}
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-extrabold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
                        {project.stage}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 font-mono">
                        {project.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-purple-400 transition-colors truncate">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Area: Progress & Leader Agent */}
                  <div className="space-y-4 pt-3 border-t border-[#27272A]/70 mt-3">
                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-semibold">
                        <span className="text-muted-foreground/70">Progress</span>
                        <span className="text-foreground font-mono">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#111113] border border-[#27272A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Agent Leader & Client Info */}
                    <div className="flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground/75">
                        <Cpu size={10} className="text-purple-400" />
                        <span>Pemimpin: <strong className="text-foreground">{project.aiAgent}</strong></span>
                      </div>
                      
                      {userRole !== "CLIENT" && (
                        <span className="text-muted-foreground/50">
                          Klien: <strong className="text-purple-400">{project.clientName}</strong>
                        </span>
                      )}
                    </div>

                    {/* Hover Button */}
                    <button
                      onClick={() => openProjectDetails(project)}
                      className="absolute inset-0 bg-[#09090B]/90 border border-purple-500/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all duration-300 backdrop-blur-xs rounded-2xl cursor-pointer"
                    >
                      <span className="text-xs font-bold text-foreground">Buka Detail Proyek</span>
                      <ChevronRight size={14} className="text-purple-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================== DETAILS VIEW ================== */
        <div className="flex flex-col gap-6 w-full select-none text-left animate-fadeIn">
          {/* Back button */}
          <div>
            <button
              onClick={() => setSelectedProject(null)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none mb-4"
            >
              <ArrowLeft size={14} />
              Kembali ke Daftar Proyek
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {selectedProject.name}
                  </h1>
                  <span className="text-[9px] font-extrabold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded leading-none mt-1">
                    {selectedProject.stage}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  {selectedProject.description}
                </p>
                <div className="flex gap-4 items-center text-[10px] text-muted-foreground/60 mt-2 font-mono">
                  <span>Dibuat: {new Date(selectedProject.createdAt).toLocaleDateString("id-ID")}</span>
                  <span>•</span>
                  <span>Klien: {selectedProject.clientName}</span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="bg-[#18181B] border border-[#27272A] px-5 py-3.5 rounded-xl flex items-center gap-4 min-w-[200px]">
                <div className="flex-1 text-left">
                  <span className="text-[9px] font-bold text-muted-foreground/50 uppercase block">Progress Total</span>
                  <span className="text-xl font-black text-foreground font-mono">{selectedProject.progress}%</span>
                  <span className="text-[9px] text-purple-400 block mt-0.5">{selectedProject.status}</span>
                </div>
                <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin shrink-0" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#27272A] gap-6 mt-4">
            <button
              onClick={() => setActiveTab("docs")}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer outline-none flex items-center gap-1.5 ${
                activeTab === "docs" ? "text-purple-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText size={14} />
              Dokumen Spesifikasi AI
              {activeTab === "docs" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer outline-none flex items-center gap-1.5 ${
                activeTab === "logs" ? "text-purple-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity size={14} />
              Aktivitas Pemrosesan Agen
              {activeTab === "logs" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer outline-none flex items-center gap-1.5 ${
                activeTab === "chat" ? "text-purple-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu size={14} />
              Chat Agen Otonom
              {activeTab === "chat" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[350px] w-full">
            {activeTab === "docs" && (
              /* TAB 1: DOCUMENTS */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
                {/* Document Sub-navigation */}
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  {(
                    [
                      { id: "BRD", title: "Kebutuhan Bisnis (BRD)", icon: FileText },
                      { id: "ARCHITECTURE", title: "Arsitektur Sistem", icon: Layers },
                      { id: "CODE", title: "Kode Sumber", icon: Code },
                    ] as const
                  ).map((doc) => {
                    const Icon = doc.icon;
                    // Check if doc exists in project
                    const exists = selectedProject.documents.some((d) => d.type === doc.id);
                    return (
                      <button
                        key={doc.id}
                        disabled={!exists}
                        onClick={() => setActiveDocTab(doc.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold text-left transition-all ${
                          !exists 
                            ? "border-transparent bg-[#111113]/30 text-muted-foreground/30 cursor-not-allowed" 
                            : activeDocTab === doc.id
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                            : "bg-[#111113] border-[#27272A] text-muted-foreground hover:text-foreground hover:bg-[#18181B] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon size={12} className={exists ? "text-purple-400" : "text-muted-foreground/30"} />
                          <span className="truncate">{doc.title}</span>
                        </div>
                        {exists && (
                          <span className="size-1.5 rounded-full bg-purple-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Document Content View */}
                <div className="md:col-span-3 bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between">
                  {(() => {
                    const activeDoc = selectedProject.documents.find((d) => d.type === activeDocTab);
                    if (!activeDoc) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground/60 select-none">
                          <Code size={32} className="text-muted-foreground/20" />
                          <p className="text-xs font-bold">Dokumen Belum Tersedia</p>
                          <p className="text-[10px] text-muted-foreground/40 max-w-xs">
                            Agen AI sedang menyelesaikan pengerjaan tahap sebelumnya sebelum menyusun file ini.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            {activeDoc.title}
                          </h3>
                          <span className="text-[9px] text-muted-foreground/60 font-mono">
                            Terakhir diupdate: {new Date(activeDoc.updatedAt).toLocaleTimeString("id-ID")}
                          </span>
                        </div>
                        <pre className="text-xs text-muted-foreground/80 leading-relaxed font-mono whitespace-pre-wrap max-h-96 overflow-y-auto bg-[#111113] p-4 rounded-xl border border-[#27272A]">
                          {activeDoc.content}
                        </pre>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              /* TAB 2: LOGS/ACTIVITIES */
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-left animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-[#27272A] pb-3 mb-4">
                  <Activity size={14} className="text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Log Pemrosesan Sistem AI
                  </h3>
                </div>
                
                <div className="relative pl-6 space-y-5 py-2">
                  {/* Vertical Line */}
                  <div className="absolute left-[24px] top-4 bottom-4 w-px bg-[#27272A]" />

                  {selectedProject.activities.map((act, idx) => (
                    <div key={idx} className="relative flex gap-4 items-start text-xs select-none">
                      {/* Timeline Dot */}
                      <div className="size-2.5 rounded-full border border-[#18181B] bg-purple-500 shadow-lg shadow-purple-500/20 shrink-0 mt-1 z-10" />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-foreground leading-normal">
                            {act.action}
                          </p>
                          <span className="text-[9px] text-muted-foreground/50 shrink-0 flex items-center gap-1 font-mono">
                            <Clock size={10} />
                            {act.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "chat" && (
              /* TAB 3: CHAT */
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-[420px] text-left animate-fadeIn">
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-[#27272A]/70 pb-3.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
                    {selectedProject.aiAgent.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      {selectedProject.aiAgent}
                    </h3>
                    <span className="text-[8px] font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded block mt-0.5 w-fit">
                      {selectedProject.aiAgentRole}
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 max-h-64">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 max-w-[80%] ${
                        msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-purple-600 text-white rounded-tr-none text-right"
                            : "bg-[#111113] border border-[#27272A] text-muted-foreground rounded-tl-none text-left"
                        }`}
                      >
                        {msg.text}
                        <span className="block text-[8px] text-muted-foreground/50 mt-1 font-mono">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2.5 border-t border-[#27272A]/70 pt-3.5 mt-2.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Kirim instruksi ke ${selectedProject.aiAgent}...`}
                    className="flex-1 h-10 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="size-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== NEW PROJECT MODAL ================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#27272A] bg-[#111113] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
                  <Sparkles size={14} />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Inisiasi Proyek Baru
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="p-6 flex flex-col gap-4 text-left overflow-y-auto">
              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sistem HR Otonom"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Deskripsi Kebutuhan Proyek
                </label>
                <textarea
                  placeholder="Jelaskan kebutuhan fungsionalitas software yang ingin dibuat..."
                  rows={4}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full rounded-xl bg-[#111113] border border-[#27272A] p-4 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* AI Agent Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Tugaskan Pemimpin Agen AI
                </label>
                <select
                  value={newProjAgent}
                  onChange={(e) => setNewProjAgent(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#111113] border border-[#27272A] px-4 text-xs text-foreground outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
                >
                  <option value="Architect-01">Architect-01 (Arsitek AI - Analisis & Struktur)</option>
                  <option value="Engineer-02">Engineer-02 (Software Engineer - Pembuat Kode)</option>
                  <option value="QA-02">QA-02 (Penjamin Mutu - Audit & Kualitas)</option>
                </select>
              </div>

              {/* Notice */}
              <div className="p-3 bg-purple-500/5 border border-purple-500/15 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  Setelah dibuat, agen AI yang ditugaskan akan langsung menganalisis kebutuhan Anda dan menyusun draft dokumen BRD (Business Requirements Document) secara otomatis.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[#27272A]/70 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#27272A] hover:bg-[#111113] text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-colors cursor-pointer outline-none"
                >
                  Mulai Proyek
                  <Sparkles size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
