"use client";

import { useState, useEffect } from "react";
import { TaskList } from "../demo/TaskList";
import { CalendarDaysIcon, RefreshCcw } from "lucide-react";
import { format, formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  dependsOn: string[];
  estimatedDays: number;
  dueDate: string;
}

export interface ProjectData {
  project: {
    name: string;
    description: string;
    estimatedDurationDays: number;
    startDate?: string;
    endDate?: string;
  };
  tasks: Task[];
}

interface ProjectReviewProps {
  data: ProjectData;
  onSave: () => void;
  onRegenerate: () => void;
  onDiscard: () => void;
}

export function ProjectReview({
  data,
  onSave,
  onRegenerate,
  onDiscard,
}: ProjectReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState(data.project.name);
  const [projectDescription, setProjectDescription] = useState(
    data.project.description,
  );
  const [projectStartDate, setProjectStartDate] = useState(
    data.project.startDate,
  );
  const [projectEndDate, setProjectEndDate] = useState(data.project.endDate);
  const [isEditing, setIsEditing] = useState<"name" | "description" | null>(
    null,
  );

  const validateDates = (start: string, end: string) => {
    if (!start || !end) return true;

    const startObj = new Date(start);
    const endObj = new Date(end);
    if (startObj > endObj) {
      toast.error("Start date cannot be later than end date");
      return false;
    }
    return true;
  };
  const handleEndDateChange = (date: Date) => {
    const end = formatISO(date, { representation: "date" });
    const start = projectStartDate!;
    if (validateDates(start, end)) {
      setProjectEndDate(end);
    }
  };
  const handleStartDateChange = (date: Date) => {
    const start = formatISO(date, { representation: "date" });
    const end = projectEndDate!;
    if (validateDates(start, end)) {
      setProjectStartDate(end);
    }
  };

  useEffect(() => {
    // Trigger slide-in animation after mount
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40
          transition-opacity duration-500
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onDiscard}
      />

      {/* Slide-in panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[800px] lg:w-[900px]
          bg-white shadow-2xl z-50
          transition-transform duration-700 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r  from-brand1 to-brand2 px-8 py-6 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  ✨ AI Generated
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  {data.tasks.length} tasks
                </span>
              </div>

              {isEditing === "name" ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={() => setIsEditing(null)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditing(null)}
                  autoFocus
                  className="text-3xl font-light text-white bg-white/10 px-3 py-1 rounded border-2 border-white/30 w-full focus:outline-none focus:border-white/60"
                />
              ) : (
                <h2
                  onClick={() => setIsEditing("name")}
                  className="text-3xl font-light text-white mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {projectName}
                </h2>
              )}

              {isEditing === "description" ? (
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  onBlur={() => setIsEditing(null)}
                  autoFocus
                  rows={3}
                  className="text-white/90 text-sm leading-relaxed bg-white/10 px-3 py-2 rounded border-2 border-white/30 w-full focus:outline-none focus:border-white/60 resize-none"
                />
              ) : (
                <p
                  onClick={() => setIsEditing("description")}
                  className="text-white/90 text-sm leading-relaxed max-w-2xl cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {projectDescription}
                </p>
              )}

              <div className="flex gap-4 mt-4 items-center w-full text-white/90">
                <div className="flex flex-col md:flex-row items-center justify-start">
                  <p className="text-xs">Start date</p>
                  <div className="">
                    <DatePicker
                      value={new Date(projectStartDate!)}
                      onChange={(date) => handleStartDateChange(date)}
                      className="h-9 rounded-md gap-1 bg-inherit hover:bg-inherit border-none cursor-pointer hover:opacity-80 hover:text-white/80 transition-opacity"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-start">
                  <p className="text-xs">End date</p>
                  <div className="">
                    <DatePicker
                      value={new Date(projectEndDate!)}
                      onChange={(date) => handleEndDateChange(date)}
                      className="h-9 rounded-md gap-1 bg-inherit hover:bg-inherit border-none cursor-pointer hover:opacity-80 hover:text-white/80 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onDiscard}
              className="ml-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Timeline overview */}
          <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Timeline Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-light text-slate-900">
                  {data.project.estimatedDurationDays}
                </div>
                <div className="text-xs text-slate-600 mt-1">Total days</div>
              </div>
              <div>
                <div className="text-2xl font-light text-slate-900">
                  {data.tasks.length}
                </div>
                <div className="text-xs text-slate-600 mt-1">Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-light text-slate-900">
                  {data.tasks.filter((t) => t.dependsOn.length > 0).length}
                </div>
                <div className="text-xs text-slate-600 mt-1">Dependencies</div>
              </div>
            </div>
          </div>

          {/* Task list */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Tasks</h3>
            <TaskList tasks={data.tasks} />
          </div>

          {/* Helpful hints */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Review your project</p>
                <p className="text-blue-700">
                  Click on the project name or description or project dates to
                  edit them. Review all tasks and their dependencies before
                  saving.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-8 py-6 bg-slate-50 border-t border-slate-200 w-full">
          <div className="flex gap-3 items-end justify-end w-full">
            <Button onClick={onDiscard} variant="destructive">
              Discard
            </Button>
            <Button onClick={onRegenerate} variant="secondary">
              <RefreshCcw /> Regenerate
            </Button>

            <Button onClick={onSave}>Save Project</Button>
          </div>
        </div>
      </div>
    </>
  );
}
