"use client";

import { useState, useEffect, Fragment, useRef } from "react";
import { cn } from "@/lib/utils";
import PromptInput from "./prompt-input";
import { ChatMessage } from "../../types";
import AIChatsResponse from "./AI-chats";
import ActionButtons from "./action-buttons";
import { SparklesIcon } from "lucide-react";

interface Message {
  text: string;
  delay: number;
}

interface ChatPageProps {
  stage: "validating" | "generating" | "saving";
  chats: ChatMessage[];
  isLoading: boolean;
  onRegenerate: () => void;
}

const STAGE_MESSAGES: Record<
  "validating" | "generating" | "saving",
  Message[]
> = {
  validating: [{ text: "Understanding your request...", delay: 0 }],
  saving: [{ text: "Saving generated project...", delay: 0 }],
  generating: [
    { text: "Initializing the project...", delay: 0 },
    { text: "Creating tasks and dependencies...", delay: 8000 },
    { text: "Almost done...", delay: 15000 },
  ],
};

export function ChatPage({
  stage,
  chats,
  isLoading,
  onRegenerate,
}: ChatPageProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [dots, setDots] = useState("");

  const onSubmit = async (prompt: string) => {
    if (!isLoading) {
      // onSubmitPrompt(prompt);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if (stage == "generating" || "validating" || "saving") {
      const messages = STAGE_MESSAGES[stage];
      setVisibleMessages([messages[0]]);

      const timers = messages.slice(1).map((msg, index) =>
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, msg]);
        }, msg.delay),
      );

      return () => timers.forEach((timer) => clearTimeout(timer));
    }
  }, [stage]);

  const lastChat = chats[chats.length - 1];

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Ambient background - more active during generation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-3xl animate-pulse-slower" />
        {isLoading && stage === "generating" && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-expand" />
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* chats */}
          {chats.map((chat, index) =>
            chat.type === "USER" ? (
              <div key={index} className="flex items-end justify-end w-full">
                <div className="w-2/3 flex items-end justify-end">
                  <div className="bg-indigo-600 text-white backdrop-blur-sm rounded-2xl rounded-tr-none px-6 py-3 shadow-sm border w-fit">
                    <p className="leading-relaxed">{chat.prompt}</p>
                  </div>
                </div>
              </div>
            ) : (
              <AIChatsResponse
                chat={chat}
                key={index}
                onRegenerate={onRegenerate}
              />
            ),
          )}

          {/* Header */}
          {isLoading && (
            <div className="text-center my-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 mb-6 animate-pulse-glow">
                <svg
                  className="w-8 h-8 text-white animate-spin-slow"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-light text-slate-800 mb-2">
                {stage === "validating"
                  ? "Validating"
                  : stage === "generating"
                    ? "Generating your project"
                    : "Saving project"}
              </h2>
              <p className="text-slate-500">This may take a moment{dots}</p>
            </div>
          )}

          {/* Messages */}
          {isLoading && (
            <div className="space-y-6">
              {visibleMessages.map((message, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 animate-message-appear"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* AI Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                    <SparklesIcon className="size-5 bg-inherit text-white" />
                  </div>

                  {/* Message bubble */}
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-4 shadow-none border">
                    <p className="text-slate-700 leading-relaxed">
                      {message.text}
                    </p>

                    {/* Show spinner for the last message */}
                    {index === visibleMessages.length - 1 && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                        <span>Working on it...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress indicator */}
          {isLoading && stage === "generating" && (
            <div className="mt-12 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>Estimated: 15-45s</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full animate-progress" />
              </div>
            </div>
          )}
          <div ref={messageEndRef}></div>
        </div>

        {lastChat.type === "ERROR" && (
          <div className="w-full border-slate-200 bg-white px-6 py-4">
            <PromptInput
              initialPrompt={""}
              onSubmitPrompt={onSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
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
