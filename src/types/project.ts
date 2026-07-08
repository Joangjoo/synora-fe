export interface BackendProject {
  id: string;
  user_id: string;
  project_name: string;
  status: string; // 'DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  created_at: string;
  updated_at: string;
  design_images?: string | null;
  design_note?: string | null;
}

export interface PipelineStage {
  project_id: string;
  production_stage_id: string;
  status: string; 
  started_at: string | null;
  completed_at: string | null;
  stage_name: string;
  sort_order: number;
}

export interface Artifact {
  id: string;
  project_id: string;
  stage_key: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
}

export interface Discovery {
  id: string;
  project_id: string;
  status: string; // 'DRAFT', 'COMPLETED'
  progress: number;
  ai_summary: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface ProjectDetailResponse {
  project: BackendProject;
  pipeline: PipelineStage[];
  artifacts: Artifact[];
  discovery: Discovery | null;
}

export interface ChatAnswer {
  id: string;
  discovery_id: string;
  question_id: string;
  sequence: number;
  sender: "USER" | "AI";
  message: string;
  created_at: string;
}
