// utils/formatProjectNarrative.ts

import { ProjectData } from "../../types";
import type { ProjectJson } from "../demo/project";

/**
 * Converts a structured ProjectJson object into a clean markdown narrative string.
 * Intentionally minimal — no HTML, no excessive decoration.
 */
export function formatProjectNarrative(data: ProjectData): string {
  const project = data.project;
  const tasks = data.tasks
  const lines: string[] = [];

  // Title
  lines.push('# Project Name')
  lines.push(`**${project.name}**`);
  lines.push("");
  // Description
  lines.push('# Description')
  lines.push("");
  lines.push(`${project.description}`);
  lines.push("");

  // Meta
  lines.push('# Estimated Duration')
  lines.push("");
  lines.push(`${project.estimatedDurationDays}`);
  lines.push("");
  lines.push('***')

  // Tasks
  if (tasks.length > 0) {
    lines.push('# Project Tasks')
    lines.push("");
    lines.push('***')

    tasks.forEach((task, index) => {
      const taskLine = `**${index + 1}.${task.title}**`;
      lines.push(taskLine);
      lines.push("");

      if (task.description) {
        lines.push(`**Description**: ${task.description}`);
        lines.push("");

      }
      if (task.description) {
        lines.push(`**Priority**: High`);
        lines.push("");

      }
      if (task.tags) {
        lines.push(`**Tags:** survey, engineering, site-preparation`)
        lines.push("");

      } else {
        lines.push(`**Tags:** survey, engineering, site-preparation`)
        lines.push("");


      }
      if (task.estimatedDays !== undefined) {
        lines.push(`**Estimated**: ${task.estimatedDays} days`);
        lines.push("");

      }
      if (task.dependsOn) {
        lines.push('**Dependencies**: None (Can start immediately)')
        lines.push("");

      } else {
        lines.push('**Dependencies**: None (Can start immediately)')
        lines.push("");

      }
      lines.push("");
      lines.push('***')

    });
  }

  return lines.join("\n");
}
