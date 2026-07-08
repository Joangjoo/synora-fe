import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectDoc {
  title: string;
  content: string;
  type: "BRD" | "ARCHITECTURE" | "CODE";
  updatedAt: string;
}

export interface ProjectActivity {
  action: string;
  time: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stage: "PENELUSURAN" | "PERENCANAAN" | "PRODUKSI" | "SELESAI";
  status: string;
  progress: number;
  aiAgent: string;
  aiAgentRole: string;
  createdAt: string;
  clientId: string;
  clientName: string;
  documents: ProjectDoc[];
  activities: ProjectActivity[];
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "documents" | "activities" | "stage" | "progress" | "status">) => Project;
  updateProjectProgress: (id: string, progress: number, stage: Project["stage"], status: string) => void;
  addProjectActivity: (id: string, action: string) => void;
  addProjectDocument: (id: string, doc: Omit<ProjectDoc, "updatedAt">) => void;
  getProjectsByClient: (clientId: string) => Project[];
}

// Initial mock projects if local storage is empty
const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "Sistem Inventaris",
    description: "Sistem manajemen stok barang gudang otomatis menggunakan integrasi AI RFID.",
    stage: "PENELUSURAN",
    status: "Penelusuran Selesai",
    progress: 35,
    aiAgent: "Architect-01",
    aiAgentRole: "Arsitek AI",
    createdAt: "2026-07-06T10:00:00Z",
    clientId: "client-1",
    clientName: "John Klien",
    documents: [
      {
        title: "Dokumen Kebutuhan Bisnis (BRD)",
        type: "BRD",
        content: `### Dokumen BRD - Sistem Inventaris\n\n**1. Deskripsi Produk**\nSistem manajemen inventaris gudang berbasis IoT dan AI untuk mengoptimalkan pencatatan barang secara otonom.\n\n**2. Cakupan Fitur**\n* Registrasi barang masuk otomatis.\n* Notifikasi sisa stok barang kritis.\n* Laporan ringkasan bulanan berbasis bahasa alami (NLP).`,
        updatedAt: "2026-07-07T14:30:00Z",
      }
    ],
    activities: [
      { action: "Proyek didaftarkan oleh klien", time: "2 hari lalu" },
      { action: "Arsitek AI menetapkan spesifikasi awal", time: "1 hari lalu" },
      { action: "Penelusuran kebutuhan selesai", time: "10 jam lalu" },
    ],
  },
  {
    id: "proj-2",
    name: "Mobile E-Commerce",
    description: "Aplikasi e-commerce seluler dengan fitur rekomendasi personal berbasis machine learning.",
    stage: "PERENCANAAN",
    status: "BRD Berhasil Dibuat",
    progress: 60,
    aiAgent: "Engineer-02",
    aiAgentRole: "Software Engineer",
    createdAt: "2026-07-05T08:00:00Z",
    clientId: "client-1",
    clientName: "John Klien",
    documents: [
      {
        title: "Dokumen Kebutuhan Bisnis (BRD)",
        type: "BRD",
        content: `### Dokumen BRD - Mobile E-Commerce\n\n**1. Pendahuluan**\nAplikasi belanja seluler yang memprioritaskan rekomendasi produk real-time bagi user.\n\n**2. Integrasi AI**\n* Recommender engine berbasis collaborative filtering.\n* Pencarian produk dengan gambar.`,
        updatedAt: "2026-07-06T09:00:00Z",
      },
      {
        title: "Arsitektur Teknis Sistem",
        type: "ARCHITECTURE",
        content: `### Arsitektur Sistem - Mobile E-Commerce\n\n* **Frontend**: Next.js App Router (React Native/Expo)\n* **Backend**: Go (Gin-Gonic) dengan PostgreSQL\n* **Engine AI**: Python FastAPI + PyTorch`,
        updatedAt: "2026-07-07T11:00:00Z",
      }
    ],
    activities: [
      { action: "Proyek dibuat", time: "3 hari lalu" },
      { action: "Dokumen BRD dirilis", time: "2 hari lalu" },
      { action: "Desain arsitektur disetujui", time: "1 hari lalu" },
    ],
  }
];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,

      addProject: (data) => {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name: data.name,
          description: data.description,
          stage: "PENELUSURAN",
          status: "Memulai Penelusuran",
          progress: 10,
          aiAgent: data.aiAgent || "Architect-01",
          aiAgentRole: data.aiAgentRole || "Arsitek AI",
          createdAt: new Date().toISOString(),
          clientId: data.clientId,
          clientName: data.clientName,
          documents: [
            {
              title: "Draft Dokumen Inisiasi Proyek",
              type: "BRD",
              content: `# Draft Inisiasi: ${data.name}\n\n**Deskripsi Proyek:**\n${data.description}\n\n*Draft sedang dianalisis oleh ${data.aiAgent}...*`,
              updatedAt: new Date().toISOString(),
            }
          ],
          activities: [
            { action: "Proyek berhasil diinisiasi", time: "Baru saja" },
            { action: `Agen AI ${data.aiAgent} mulai menganalisis deskripsi proyek`, time: "Baru saja" }
          ],
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
        }));

        return newProject;
      },

      updateProjectProgress: (id, progress, stage, status) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, progress, stage, status } : p
          ),
        }));
      },

      addProjectActivity: (id, action) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  activities: [
                    { action, time: "Baru saja" },
                    ...p.activities,
                  ],
                }
              : p
          ),
        }));
      },

      addProjectDocument: (id, doc) => {
        const newDoc: ProjectDoc = {
          ...doc,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  documents: [...p.documents, newDoc],
                }
              : p
          ),
        }));
      },

      getProjectsByClient: (clientId) => {
        return get().projects.filter((p) => p.clientId === clientId);
      },
    }),
    {
      name: "synora-projects-store",
    }
  )
);
