"use client";

import { Task } from "../AI/project-preview";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const priorityConfig = {
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
      label: "High Priority",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      label: "Medium",
    },
    low: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      label: "Low",
    },
  };

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const config = priorityConfig[task.priority];

        return (
          <div
            key={task.id}
            className={`
              relative p-5 rounded-xl border-2
              ${config.bg} ${config.border}
              transition-all duration-300
              hover:shadow-md hover:scale-[1.01]
              animate-task-appear
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Task number badge */}
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
              {index + 1}
            </div>

            {/* Task header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-slate-900 mb-1">
                  {task.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Priority badge */}
              <span
                className={`
                inline-flex items-center px-3 py-1 rounded-full
                text-xs font-medium whitespace-nowrap
                ${config.badge}
              `}
              >
                {config.label}
              </span>
            </div>

            {/* Task metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {task.estimatedDays}{" "}
                  {task.estimatedDays === 1 ? "day" : "days"}
                </span>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Due{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Dependencies */}
            {task.dependsOn.length > 0 && (
              <div className="mb-3 p-3 bg-white/60 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-600 mb-1">
                      Depends on:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.dependsOn.map((depId) => {
                        const depTask = getTaskById(depId);
                        return depTask ? (
                          <span
                            key={depId}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-slate-300 text-xs text-slate-700"
                            title={depTask.description}
                          >
                            {depTask.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes task-appear {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-task-appear {
          animation: task-appear 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
