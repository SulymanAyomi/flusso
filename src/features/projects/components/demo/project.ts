// types/project.ts

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  estimatedHours?: number;
}

export interface ProjectJson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "6 weeks"
  tasks: ProjectTask[];
  createdAt?: string;
}
