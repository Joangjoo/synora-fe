"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";
import axios from "axios";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  BackendProject,
  Discovery,
  ProjectDetailResponse,
  ChatAnswer,
} from "@/types/project";

// Import modular sub-components
import { ProjectList } from "@/components/projects/ProjectList";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { DiscoveryChat } from "@/components/projects/DiscoveryChat";
import { ProjectDetailTabs } from "@/components/projects/ProjectDetailTabs";
import { DeleteProjectModal } from "@/components/projects/DeleteProjectModal";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);

  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [selectedProjectDetail, setSelectedProjectDetail] =
    useState<ProjectDetailResponse | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Discovery Chat State
  const [chatMessages, setChatMessages] = useState<ChatAnswer[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Delete Modal State
  const [projectToDelete, setProjectToDelete] = useState<BackendProject | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const userRole = user?.role || "CLIENT";

  // Fetch projects list
  const fetchProjects = useCallback(async () => {
    try {
      const response = await api.get<BackendProject[]>("/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Gagal memuat proyek:", err);
      toast.error("Gagal memuat proyek", {
        description:
          "Pastikan koneksi internet Anda stabil dan server backend menyala.",
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get<BackendProject[]>("/projects")
      .then((response) => {
        if (isMounted) {
          setProjects(response.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat proyek:", err);
        toast.error("Gagal memuat proyek", {
          description:
            "Pastikan koneksi internet Anda stabil dan server backend menyala.",
        });
      });

    const timer = setTimeout(() => {
      if (isMounted) setIsLoaded(true);
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Fetch project details
  const loadProjectDetails = async (projectId: string) => {
    try {
      const response = await api.get<ProjectDetailResponse>(
        `/projects/${projectId}`,
      );
      setSelectedProjectDetail(response.data);

      // If project is still DRAFT (Discovery Phase), load chat history
      if (response.data.project.status === "DRAFT") {
        const chatResp = await api.get<{ answers: ChatAnswer[] }>(
          `/discoveries/${projectId}/chat`,
        );
        setChatMessages(chatResp.data.answers);
      }
    } catch (err) {
      console.error("Gagal memuat detail proyek:", err);
      toast.error("Gagal mengambil detail proyek");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectIdParam = params.get("id");
    if (projectIdParam) {
      setTimeout(() => {
        loadProjectDetails(projectIdParam);
      }, 0);
    }
  }, []);

  // Poll selected project details if active in pipeline
  useEffect(() => {
    if (!selectedProjectDetail) return;
    
    const status = selectedProjectDetail.project.status;
    if (status !== "IN_PROGRESS" && status !== "SUBMITTED") return;

    const interval = setInterval(() => {
      api.get<ProjectDetailResponse>(`/projects/${selectedProjectDetail.project.id}`)
        .then((response) => {
          setSelectedProjectDetail(response.data);
        })
        .catch((err) => {
          console.error("Gagal memperbarui detail proyek secara real-time:", err);
        });
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedProjectDetail?.project?.id, selectedProjectDetail?.project?.status, selectedProjectDetail]);

  const handleCreateProject = async (
    name: string,
    designImages: string,
    designNote: string,
  ) => {
    setIsCreating(true);
    try {
      const response = await api.post<BackendProject>("/projects", {
        project_name: name,
        design_images: designImages || null,
        design_note: designNote || null,
      });

      toast.success("Proyek Berhasil Diinisiasi!", {
        description: "Mengarahkan ke Sesi Discovery AI...",
      });

      setIsModalOpen(false);

      // Refresh list and open details
      await fetchProjects();
      loadProjectDetails(response.data.id);
    } catch (err) {
      let errMsg = "Gagal membuat proyek baru.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errMsg = err.response.data.error;
      }
      toast.error("Gagal Membuat Proyek", {
        description: errMsg,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedProjectDetail || isSendingMessage) return;

    const projectId = selectedProjectDetail.project.id;
    const msg = chatInput;
    setChatInput("");
    setIsSendingMessage(true);

    // Optimistically add user message to chat UI
    const tempUserMsg: ChatAnswer = {
      id: `temp-${Date.now()}`,
      discovery_id: selectedProjectDetail.discovery?.id || "",
      question_id: "",
      sequence: chatMessages.length + 1,
      sender: "USER",
      message: msg,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await api.post<{
        answers: ChatAnswer[];
        discovery: Discovery;
      }>(`/discoveries/${projectId}/chat`, { message: msg });

      setChatMessages(response.data.answers);
      setSelectedProjectDetail((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          discovery: response.data.discovery,
        };
      });

      // If progress changed, show toast
      toast.success("Jawaban direkam", {
        description: `Kemajuan Discovery Anda sekarang ${response.data.discovery.progress}%.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim pesan");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!selectedProjectDetail || isSubmittingProject) return;
    const projectId = selectedProjectDetail.project.id;

    setIsSubmittingProject(true);
    try {
      await api.post(`/projects/${projectId}/submit`);
      toast.success("Proyek Berhasil Dikirim!", {
        description:
          "Proyek sedang menunggu review CEO atau COO untuk diproduksi.",
      });
      setSelectedProjectDetail(null);
      fetchProjects();
    } catch {
      toast.error("Gagal mengirim proyek untuk direview");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleApproveProject = async () => {
    if (!selectedProjectDetail || isApproving) return;
    const projectId = selectedProjectDetail.project.id;

    setIsApproving(true);
    try {
      await api.post(`/projects/${projectId}/approve`);
      toast.success("Proyek Disetujui!", {
        description:
          "Pipelines produksi AI otonom telah dijalankan di latar belakang.",
      });
      loadProjectDetails(projectId);
      fetchProjects();
    } catch {
      toast.error("Gagal menyetujui proyek");
    } finally {
      setIsApproving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      await api.delete(`/projects/${projectToDelete.id}`);
      toast.success("Proyek berhasil dihapus");
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      console.error("Gagal menghapus proyek:", err);
      toast.error("Gagal menghapus proyek");
    } finally {
      setIsDeletingProject(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "SUBMITTED":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "IN_PROGRESS":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "COMPLETED":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      default:
        return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    }
  };

  const getStatusIndonesian = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Penelusuran AI";
      case "SUBMITTED":
        return "Menunggu Review";
      case "IN_PROGRESS":
        return "Produksi AI";
      case "COMPLETED":
        return "Selesai";
      default:
        return status;
    }
  };

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 text-left">
          <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          <p className="text-xs text-muted-foreground/60 font-semibold tracking-widest uppercase animate-pulse">
            Menghubungkan Database...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" theme="dark" richColors />

      {!selectedProjectDetail ? (
        /* ================== LIST VIEW ================== */
        <ProjectList
          projects={projects}
          userRole={userRole}
          onOpenCreateModal={() => setIsModalOpen(true)}
          onSelectProject={(id) => loadProjectDetails(id)}
          onDeleteProject={(proj) => setProjectToDelete(proj)}
        />
      ) : (
        /* ================== DETAILS VIEW ================== */
        <div className="flex flex-col gap-6 w-full select-none text-left animate-fadeIn">
          {/* Back button */}
          <div>
            <button
              onClick={() => {
                setSelectedProjectDetail(null);
                fetchProjects();
              }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none border-none bg-transparent mb-6 font-bold"
            >
              <ArrowLeft size={16} />
              Kembali ke Daftar Proyek
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black tracking-tight text-foreground">
                    {selectedProjectDetail.project.project_name}
                  </h1>
                  <span
                    className={`text-[11px] font-extrabold tracking-widest uppercase border px-3 py-1 rounded leading-none mt-1 ${getStatusColor(selectedProjectDetail.project.status)}`}
                  >
                    {getStatusIndonesian(selectedProjectDetail.project.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/90 max-w-2xl leading-relaxed font-semibold">
                  {selectedProjectDetail.project.status === "DRAFT"
                    ? "Lakukan tanya jawab terstruktur dengan Business Analyst AI untuk merancang spesifikasi kebutuhan dasar proyek Anda."
                    : "Pantau perkembangan analisis, desain arsitektur, skema basis data, dan kode program yang digarap secara otonom oleh para agen AI."}
                </p>
                <div className="flex gap-4 items-center text-xs text-muted-foreground/70 mt-3 font-mono font-medium">
                  <span>
                    Dibuat:{" "}
                    {new Date(
                      selectedProjectDetail.project.created_at,
                    ).toLocaleDateString("id-ID")}
                  </span>
                  <span>•</span>
                  <span>
                    ID Proyek:{" "}
                    {selectedProjectDetail.project.id.substring(0, 8)}
                  </span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="bg-[#18181B] border border-[#27272A] px-6 py-4 rounded-xl flex items-center gap-5 min-w-[260px]">
                <div className="flex-1 text-left">
                  <span className="text-[11px] font-extrabold text-muted-foreground/60 uppercase block tracking-wider">
                    Kemajuan Proses
                  </span>
                  <span className="text-2xl font-black text-foreground font-mono">
                    {
                      selectedProjectDetail.project.status === "DRAFT"
                        ? selectedProjectDetail.discovery?.progress || 10
                        : selectedProjectDetail.project.status === "SUBMITTED"
                          ? 20
                          : selectedProjectDetail.project.status === "COMPLETED"
                            ? 100
                            : 50 // In Progress
                    }
                    %
                  </span>
                  <span className="text-[11px] text-purple-400 block mt-0.5 font-bold">
                    {selectedProjectDetail.project.status === "DRAFT"
                      ? "Wawancara Klien"
                      : "Pipeline Produksi"}
                  </span>
                </div>
                {selectedProjectDetail.project.status === "COMPLETED" ? (
                  <CheckCircle2 className="size-10 text-emerald-400 shrink-0 animate-fadeIn" />
                ) : (
                  <div className="size-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin shrink-0" />
                )}
              </div>
            </div>
          </div>

          {selectedProjectDetail.project.status === "DRAFT" ? (
            
            <DiscoveryChat
              projectDetail={selectedProjectDetail}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isSendingMessage={isSendingMessage}
              isSubmittingProject={isSubmittingProject}
              onSendMessage={handleSendMessage}
              onSubmitForReview={handleSubmitForReview}
            />
          ) : (
            // Tabs
            <ProjectDetailTabs
              projectDetail={selectedProjectDetail}
              userRole={userRole}
              isApproving={isApproving}
              onApprove={handleApproveProject}
            />
          )}
        </div>
      )}
      {/* Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
        isCreating={isCreating}
      />
      <DeleteProjectModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingProject}
        projectName={projectToDelete?.project_name || ""}
      />
    </DashboardLayout>
  );
}
