// app/demo/page.tsx  (or wherever you want to demo this)
"use client";

import { useState } from "react";
import { ChatMessage } from "../AI/ChatMessage";
import type { ProjectJson } from "./project";

// Simulated backend response — in production this comes from your API.
const MOCK_PROJECT: ProjectJson = {
  id: "proj_01",
  title: "Customer Portal Redesign",
  description:
    "A full redesign of the customer-facing portal to improve onboarding conversion, reduce support tickets, and align the UI with the updated brand system.",
  duration: "8 weeks",
  tasks: [
    {
      id: "t1",
      title: "Discovery & Requirements",
      description:
        "Stakeholder interviews, analytics audit, competitor review.",
      estimatedHours: 16,
    },
    {
      id: "t2",
      title: "UX Wireframes",
      description: "Low-fidelity flows for all critical paths.",
      estimatedHours: 24,
    },
    {
      id: "t3",
      title: "Design System Tokens",
      description: "Colour, typography, and spacing tokens in Figma + CSS.",
      estimatedHours: 12,
    },
    {
      id: "t4",
      title: "Frontend Implementation",
      description: "Next.js + Tailwind build, component library, unit tests.",
      estimatedHours: 80,
    },
    {
      id: "t5",
      title: "QA & Accessibility Audit",
      description: "WCAG 2.1 AA compliance, cross-browser testing.",
      estimatedHours: 20,
    },
  ],
};

export default function DemoPage() {
  const [project, setProject] = useState<ProjectJson | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleGenerateProject = () => {
    // In production: const data = await fetch("/api/generate-project").then(r => r.json())
    setProject(MOCK_PROJECT);
    setIsPanelOpen(false); // Reset panel if a new project comes in
  };

  const handleStreamComplete = (completedProject: ProjectJson) => {
    // Called by ChatMessage once the full narrative has been revealed
    setIsPanelOpen(true);
    console.log("Stream complete, opening panel for:", completedProject.id);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* ── Chat Area ─────────────────────────────────────────── */}
      <main
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isPanelOpen ? "mr-[420px]" : ""
        }`}
      >
        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {/* User message */}
          {project && (
            <div className="flex justify-end">
              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 text-sm max-w-sm shadow-sm">
                Generate a project plan for the customer portal redesign.
              </div>
            </div>
          )}

          {/* AI streaming message */}
          {project && (
            <ChatMessage
              project={project}
              onStreamComplete={handleStreamComplete}
              speed={700}
            />
          )}
        </div>

        {/* Prompt bar */}
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={handleGenerateProject}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-medium py-3 transition-all duration-150"
          >
            {project ? "Generate another project →" : "Generate project plan →"}
          </button>
        </div>
      </main>

      {/* ── Preview Panel ──────────────────────────────────────── */}
      <aside
        className={`fixed right-0 top-0 h-full w-[420px] bg-white border-l border-slate-200 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isPanelOpen}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
            Project Preview
          </h2>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
            aria-label="Close panel"
          >
            ✕
          </button>
        </header>

        {project && (
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 text-sm text-slate-700">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Title
              </p>
              <p className="font-semibold text-slate-900">{project.title}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Duration
              </p>
              <p>{project.duration}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="leading-relaxed">{project.description}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Tasks ({project.tasks.length})
              </p>
              <ol className="space-y-3">
                {project.tasks.map((task, i) => (
                  <li key={task.id} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{task.title}</p>
                      {task.description && (
                        <p className="text-slate-500 text-xs mt-0.5">
                          {task.description}
                        </p>
                      )}
                      {task.estimatedHours !== undefined && (
                        <p className="text-indigo-500 text-xs mt-0.5">
                          {task.estimatedHours}h estimated
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
