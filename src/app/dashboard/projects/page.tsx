"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "sonner";

// Import modular sub-components
import { ProjectList } from "@/components/projects/ProjectList";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { DiscoveryChat } from "@/components/projects/DiscoveryChat";
import { ProjectDetailTabs } from "@/components/projects/ProjectDetailTabs";
import { DeleteProjectModal } from "@/components/projects/DeleteProjectModal";
import { ProjectDetailHeader } from "@/components/projects/ProjectDetailHeader";

// Import custom hook
import { useProjectsPage } from "@/hooks/useProjectsPage";

export default function ProjectsPage() {
  const {
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
  } = useProjectsPage();

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
        <ProjectList
          projects={projects}
          onOpenCreateModal={() => setIsModalOpen(true)}
          onSelectProject={(id) => loadProjectDetails(id)}
          onDeleteProject={(id: string) => {
            const proj = projects.find((p) => p.id === id);
            if (proj) setProjectToDelete(proj);
          }}
        />
      ) : (
        <div className="flex flex-col gap-6 w-full select-none text-left animate-fadeIn">
          <ProjectDetailHeader
            projectDetail={selectedProjectDetail}
            onBack={() => {
              setSelectedProjectDetail(null);
              fetchProjects();
            }}
          />

          {selectedProjectDetail.project.status === "DRAFT" && (selectedProjectDetail.discovery?.status !== "COMPLETED" && (selectedProjectDetail.discovery?.progress ?? 0) < 90) ? (
            <DiscoveryChat
              projectDetail={selectedProjectDetail}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isSendingMessage={isSendingMessage}
              onSendMessage={handleSendMessage}
            />
          ) : (
            // Tabs
            <ProjectDetailTabs
              projectDetail={selectedProjectDetail}
              onSendBRD={handleSendBRD}
              onSendFinalDocs={handleSendFinalDocs}
              onProcessRevision={handleProcessRevision}
            />
          )}
        </div>
      )}
      {/* Modals */}
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
