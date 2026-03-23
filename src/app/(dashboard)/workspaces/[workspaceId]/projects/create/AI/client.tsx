"use client";

import { CreatePrompt } from "@/features/projects/components/AI/create-prompt";
import { ChatPage } from "@/features/projects/components/AI/chat";
import { useProjectFlow } from "@/features/projects/components/AI/useprojectflow";
import { ProjectReview } from "@/features/projects/components/AI/project-preview";

const CreateProjectAIPageClient = () => {
  const {
    flowState,
    startGeneration,
    reset,
    regenerate,
    isLoading,
    chatMessage,
    prompt,
    project,
    isPanelOpen,
    setIsPanelOpen,
    handleRegenerate,
    saveProject,
  } = useProjectFlow();

  // Handle discard action
  const handleDiscard = () => {
    // if (confirm("Are you sure you want to discard this project?")) {
    //   // reset();
    // }
    setIsPanelOpen(false);
    reset();
  };
  const closePanel = () => {
    setIsPanelOpen(false);
  };
  const handleOpen = () => {
    setIsPanelOpen(true);
  };

  return (
    <>
      {/* Stage 1: Prompt Input */}
      {flowState.stage === "idle" ? (
        <CreatePrompt
          onSubmitPrompt={startGeneration}
          isLoading={isLoading}
          prompt={prompt}
        />
      ) : (
        <ChatPage
          stage={flowState.stage}
          chats={chatMessage}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
        />
      )}

      {/* Stage 2: Review */}
      {isPanelOpen && project && (
        <ProjectReview
          data={project}
          // @ts-ignore
          onSave={saveProject}
          onRegenerate={regenerate}
          onDiscard={handleDiscard}
          closePanel={closePanel}
          isLoading={isLoading}
        />
      )}

      {/* Stage 5: Generation */}
    </>
  );
};

export default CreateProjectAIPageClient;
