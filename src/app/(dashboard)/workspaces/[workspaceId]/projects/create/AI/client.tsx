"use client";

import { CreatePrompt } from "@/features/projects/components/AI/create-prompt";
import { ChatPage } from "@/features/projects/components/AI/chat";
import { useProjectFlow } from "@/features/projects/components/AI/useprojectflow";
import { ProjectReview } from "@/features/projects/components/AI/project-preview";
import { useState } from "react";
import { ProjectData } from "@/features/projects/types";

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
  } = useProjectFlow();

  const handleSave = () => {
    // TODO: Implement save to database
    // reset();
    handleRegenerate();
  };

  // Handle discard action
  const handleDiscard = () => {
    // if (confirm("Are you sure you want to discard this project?")) {
    //   // reset();
    // }
    setIsPanelOpen(false);
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
        />
      )}

      {/* Stage 2: Review */}
      {isPanelOpen && project && (
        <ProjectReview
          data={project}
          onSave={handleSave}
          onRegenerate={regenerate}
          onDiscard={handleDiscard}
        />
      )}

      {/* Stage 5: Generation */}
    </>
  );
};

export default CreateProjectAIPageClient;
