import { User, Session } from '@supabase/supabase-js';

// Auth Types
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

// Project Types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  bolt_project_id: string;
  idea_summary: IdeaSummary | null;
  created_at: string;
  updated_at: string;
  deployment_status?: DeploymentStatus;
  deployment_url?: string;
}

export interface IdeaSummary {
  purpose: string;
  target_audience: string;
  key_features: string[];
  design_preferences: {
    color_scheme: string;
    style: string;
    layout: string;
  };
  content_sections: string[];
}

// Message Types
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface ProjectResponse {
  project: Project;
}

export interface ChatResponse {
  response: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface NewProjectFormData {
  name: string;
  description: string;
}

// Deployment Types
export type DeploymentStatus = 'not_deployed' | 'deploying' | 'deployed' | 'failed';

export interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  beginner_friendly: boolean;
  free_tier: boolean;
  steps: string[];
}

export interface DeploymentStep {
  title: string;
  description: string;
  details: string[];
}

export interface DeploymentResource {
  title: string;
  url: string;
}

export interface DeploymentInstructions {
  title: string;
  description: string;
  steps: DeploymentStep[];
  resources: DeploymentResource[];
}

export interface DeploymentOptionsResponse {
  options: DeploymentOption[];
}

export interface DeploymentInstructionsResponse {
  instructions: DeploymentInstructions;
}