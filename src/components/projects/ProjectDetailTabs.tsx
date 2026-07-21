"use client";

import React, { useState } from "react";
import { 
  Folder, 
  Cpu, 
  Layers, 
  FileText, 
  Activity as ActivityIcon
} from "lucide-react";
import { toast } from "sonner";
import { ProjectDetailResponse, Artifact } from "@/types/project";
import { OverviewTab } from "./tabs/OverviewTab";
import { DiscoveryTab } from "./tabs/DiscoveryTab";
import { PipelineTab } from "./tabs/PipelineTab";
import { ArtifactsTab } from "./tabs/ArtifactsTab";
import { ActivityTab } from "./tabs/ActivityTab";

interface ProjectDetailTabsProps {
  projectDetail: ProjectDetailResponse;
  onSendBRD?: (id: string) => void;
  onSendFinalDocs?: (id: string) => void;
}

export function ProjectDetailTabs({
  projectDetail,
  onSendBRD,
  onSendFinalDocs,
  onProcessRevision
}: ProjectDetailTabsProps & { onProcessRevision?: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "discovery" | "pipeline" | "artifacts" | "activity">("overview");
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);

  const artifacts = projectDetail.artifacts || [];

  const handleDownloadMarkdown = (art: Artifact) => {
    const blob = new Blob([art.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${art.stage_key}.md`;
    a.click();
    toast.success("Dokumen diunduh");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#27272A] gap-8 mb-4">
        {(
          [
            { id: "overview", title: "Ringkasan", icon: Folder },
            { id: "discovery", title: "Discovery Summary", icon: Cpu },
            { id: "pipeline", title: "Pipeline Produksi", icon: Layers },
            { id: "artifacts", title: "Hasil Dokumen AI", icon: FileText },
            { id: "activity", title: "Log Aktivitas", icon: ActivityIcon }
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3.5 text-sm font-bold transition-all relative cursor-pointer outline-none border-none bg-transparent flex items-center gap-2 ${
                activeTab === t.id ? "text-purple-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={15} />
              {t.title}
              {activeTab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px] w-full text-left">
        {activeTab === "overview" && (
          <OverviewTab
            projectDetail={projectDetail}
            artifacts={artifacts}
            onProcessRevision={onProcessRevision}
          />
        )}

        {activeTab === "discovery" && (
          <DiscoveryTab
            projectDetail={projectDetail}
            onSendBRD={onSendBRD}
          />
        )}

        {activeTab === "pipeline" && (
          <PipelineTab
            projectDetail={projectDetail}
          />
        )}

        {activeTab === "artifacts" && (
          <ArtifactsTab
            projectDetail={projectDetail}
            artifacts={artifacts}
            previewArtifact={previewArtifact}
            setPreviewArtifact={setPreviewArtifact}
            onSendFinalDocs={onSendFinalDocs}
            handleDownloadMarkdown={handleDownloadMarkdown}
          />
        )}

        {activeTab === "activity" && (
          <ActivityTab
            projectDetail={projectDetail}
          />
        )}
      </div>
    </div>
  );
}
