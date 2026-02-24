"use client";

import { QuickPrompts } from "../demo/Quickprompts";
import PromptInput from "./prompt-input";

interface CreateAIProjectProps {
  prompt: string;
  onSubmitPrompt: (prompt: string) => Promise<void>;
  isLoading: boolean;
}
export const CreatePrompt = ({
  prompt,
  onSubmitPrompt,
  isLoading,
}: CreateAIProjectProps) => {
  const handleQuickPromptSelect = (prompt: string) => {
    onSubmitPrompt(prompt);
  };

  const onSubmit = async (prompt: string) => {
    if (!isLoading) {
      onSubmitPrompt(prompt);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-3 lg:px-8 pt-6 md:pt-3 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-3xl animate-float-delayed" />
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl md:text-4xl text-center">
          What do you want to build today?
        </h1>
        <div>
          <p className="text-neutral-600 text-center">
            Let's turn your ideas into a project and build together.
          </p>
        </div>
      </div>
      <div className="flex w-full justify-center gap-4 text-center px-6 overflow-y-scroll scroll-smooth ">
        {!isLoading && prompt.length === 0 && (
          <div
            className="mt-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <QuickPrompts onSelect={handleQuickPromptSelect} />
          </div>
        )}
      </div>
      <div className="w-full mt-4 px-4 flex rounded-md">
        <PromptInput
          initialPrompt={prompt}
          onSubmitPrompt={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
