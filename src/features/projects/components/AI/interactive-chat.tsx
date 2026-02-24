"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import PromptInput from "./prompt-input";
import AIChatsResponse from "./AI-chats";
import { ChatMessage } from "../../types";

interface Message {
  text: string;
  delay: number;
}

interface ChatPageProps {
  stage: "idle" | "error";
  chats: ChatMessage[];
  isLoading: boolean;
}

const STAGE_MESSAGES: Record<"validating" | "generating", Message[]> = {
  validating: [{ text: "Understanding your request...", delay: 0 }],
  generating: [
    { text: "Initializing the project...", delay: 0 },
    { text: "Creating tasks and dependencies...", delay: 8000 },
    { text: "Almost done...", delay: 15000 },
  ],
};

export function InteractiveChat({ stage, chats, isLoading }: ChatPageProps) {
  const onSubmit = async (prompt: string) => {
    if (!isLoading) {
      // onSubmitPrompt(prompt);
    }
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Ambient background - more active during generation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      <div className="relative z-10 overflow-y-scroll overflow-x-hidden  min-h-screen px-2 py-4 h-full">
        <div className="h-full w-full max-w-2xl relative mx-auto">
          <div className="w-full h-full space-y-6 ">
            {/* chats */}
            {chats.map((chat, index) =>
              chat.type === "USER" ? (
                <div
                  key={index}
                  className="flex items-end justify-end w-full max-w-2xl"
                >
                  <div className="w-2/3 flex items-end justify-end">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tr-none px-6 py-4 shadow-none border w-fit">
                      <p className="text-slate-700 leading-relaxed">
                        {chat.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <AIChatsResponse chat={chat} key={index} />
              ),
            )}
          </div>
        </div>
        <div className="w-full mt-4 px-4 flex rounded-md bottom-1 sticky mx-auto max-w-2xl">
          <div className="w-full mx-auto">
            <PromptInput
              initialPrompt={""}
              onSubmitPrompt={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.08);
          }
        }

        @keyframes expand {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 0.1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.7);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes message-appear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 60%;
          }
          100% {
            width: 90%;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
        }

        .animate-expand {
          animation: expand 3s ease-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-message-appear {
          animation: message-appear 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-progress {
          animation: progress 30s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
