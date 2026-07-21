"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import {
  BackendProject,
  Discovery,
  ProjectDetailResponse,
  ChatAnswer,
} from "@/types/project";

export function useProjectsPage() {
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

  // Delete Modal State
  const [projectToDelete, setProjectToDelete] = useState<BackendProject | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

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
    const createParam = params.get("create");
    if (createParam === "true") {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 0);
      // Clean query params so it doesn't open again on page refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Poll selected project details if active in pipeline or generating BRD
  useEffect(() => {
    if (!selectedProjectDetail) return;
    
    const status = selectedProjectDetail.project.status;
    const discoveryStatus = selectedProjectDetail.discovery?.status;
    const discoveryProgress = selectedProjectDetail.discovery?.progress || 0;

    const isPipelineActive = status === "IN_PROGRESS" || status === "SUBMITTED";
    const isGeneratingBRD = discoveryStatus !== "COMPLETED" && discoveryProgress >= 90;

    if (!isPipelineActive && !isGeneratingBRD) return;

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
  }, [selectedProjectDetail?.project?.id, selectedProjectDetail?.project?.status, selectedProjectDetail?.discovery?.status, selectedProjectDetail?.discovery?.progress, selectedProjectDetail]);

  const handleCreateProject = async (
    name: string,
    clientName: string,
    clientEmail: string,
    categoryId: string | null,
    designImages: string,
    designNote: string,
  ) => {
    setIsCreating(true);
    try {
      const response = await api.post<BackendProject>("/projects", {
        project_name: name,
        client_name: clientName,
        client_email: clientEmail,
        category_id: categoryId,
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

  const handleSendMessage = async (e: React.FormEvent, isSkip: boolean = false) => {
    e.preventDefault();
    if ((!chatInput.trim() && !isSkip) || !selectedProjectDetail || isSendingMessage) return;

    const projectId = selectedProjectDetail.project.id;
    const msg = isSkip ? "[Klien Meminta Skip Topik Ini]" : chatInput;
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
      }>(`/discoveries/${projectId}/chat`, { message: isSkip ? "SKIP" : msg, is_skip: isSkip });

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

  const handleSendBRD = async (id: string) => {
    try {
      await api.post(`/projects/${id}/send-brd`);
      toast.success("BRD berhasil dikirim ke email klien!");
    } catch (err) {
      console.error("Gagal mengirim BRD:", err);
      toast.error("Gagal mengirim BRD");
    }
  };

  const handleProcessRevision = async (id: string) => {
    try {
      await api.post(`/projects/${id}/process-revision`);
      toast.success("Mode revisi diaktifkan! Silakan berdiskusi di chat Discovery.");
      await fetchProjects();
      
      // Delay sedikit agar state backend benar-benar selesai lalu render tab ulang
      setTimeout(() => {
        loadProjectDetails(id);
      }, 100);
      
    } catch (err) {
      console.error("Gagal memproses revisi:", err);
      toast.error("Gagal membuka mode revisi");
    }
  };

  const handleSendFinalDocs = async (id: string) => {
    try {
      await api.post(`/projects/${id}/send-final-docs`);
      toast.success("Notifikasi dokumen final berhasil dikirim ke klien!");
    } catch (err) {
      console.error("Gagal mengirim notifikasi final:", err);
      toast.error("Gagal mengirim notifikasi final");
    }
  };

  return {
    isLoaded,
    projects,
    selectedProjectDetail,
    setSelectedProjectDetail,
    isModalOpen,
    setIsModalOpen,
    isCreating,
    chatMessages,
    chatInput,
    setChatInput,
    isSendingMessage,
    projectToDelete,
    setProjectToDelete,
    isDeletingProject,
    fetchProjects,
    loadProjectDetails,
    handleCreateProject,
    handleSendMessage,
    handleConfirmDelete,
    handleSendBRD,
    handleProcessRevision,
    handleSendFinalDocs,
  };
}
