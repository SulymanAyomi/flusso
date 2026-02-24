"use client";

import { PromptPage } from "./prompt-page";
import { ChatPage } from "../AI/chat";
import { ProjectReview } from "../AI/project-preview";
import { useProjectFlow } from "./useprojectflow";

export default function ProjectCreationFlow() {
  const { flowState, startGeneration, retry, reset, regenerate } =
    useProjectFlow();

  // Handle save action
  const handleSave = () => {
    if (flowState.stage === "review") {
      // TODO: Implement save to database
      console.log("Saving project:", flowState.data);
      alert("Save functionality will be implemented in the next phase!");
      reset();
    }
  };

  // Handle discard action
  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this project?")) {
      reset();
    }
  };

  return (
    <>
      {/* Stage 1: Prompt Input */}
      {flowState.stage === "idle" && (
        <PromptPage onSubmit={startGeneration} isLoading={false} />
      )}

      {/* Stage 2: Validation */}
      {flowState.stage === "validating" && <ChatPage stage="validating" />}

      {/* Stage 3: Generation */}
      {flowState.stage === "generating" && <ChatPage stage="generating" />}

      {/* Stage 4: Review */}
      {flowState.stage === "review" && (
        <ProjectReview
          data={flowState.data}
          onSave={handleSave}
          onRegenerate={regenerate}
          onDiscard={handleDiscard}
        />
      )}

      {/* Error State */}
      {flowState.stage === "error" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-100 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-light text-slate-900 mb-2">
              {flowState.failedAt === "validation"
                ? "Invalid Prompt"
                : "Generation Failed"}
            </h2>

            <p className="text-slate-600 mb-6">{flowState.error.message}</p>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-6 py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-medium hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                Start Over
              </button>

              <button
                onClick={retry}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
