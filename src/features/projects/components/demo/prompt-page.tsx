"use client";

import { useState } from "react";
import { QuickPrompts } from "./Quickprompts";

interface PromptPageProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  initialPrompt?: string;
}

export function PromptPage({
  onSubmit,
  isLoading = false,
  initialPrompt = "",
}: PromptPageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleQuickPromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const charCount = prompt.length;
  const minChars = 10;
  const maxChars = 500;
  const isValidLength = charCount >= minChars && charCount <= maxChars;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight text-slate-900 mb-4">
            Flusso
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Transform ideas into structured projects with AI.
            <br />
            <span className="text-slate-500">
              Describe your project in natural language.
            </span>
          </p>
        </div>

        {/* Main prompt card */}
        <div
          className="w-full max-w-3xl animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <form onSubmit={handleSubmit}>
            <div
              className={`
                relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl
                transition-all duration-500 ease-out
                ${
                  isFocused
                    ? "shadow-2xl shadow-blue-500/10 scale-[1.01]"
                    : "shadow-lg"
                }
              `}
            >
              {/* Decorative border gradient */}
              <div
                className={`
                  absolute inset-0 rounded-2xl transition-opacity duration-500
                  bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-blue-500/20
                  ${isFocused ? "opacity-100" : "opacity-0"}
                `}
                style={{ padding: "2px", zIndex: -1 }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </div>

              <div className="p-8">
                <label
                  htmlFor="prompt-input"
                  className="block text-sm font-medium text-slate-700 mb-3"
                >
                  What would you like to build?
                </label>

                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Plan a product launch for our new mobile app..."
                  disabled={isLoading}
                  rows={6}
                  className={`
                    w-full px-4 py-4 text-lg
                    bg-slate-50/50 border-2 rounded-xl
                    transition-all duration-300
                    placeholder:text-slate-400 placeholder:font-light
                    focus:outline-none focus:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    resize-none
                    ${
                      isFocused
                        ? "border-blue-500 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }
                  `}
                  style={{
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                />

                {/* Character counter */}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isValidLength || isLoading}
                  className={`
                    w-full mt-6 px-8 py-4 rounded-xl
                    font-medium text-lg
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isValidLength && !isLoading
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Initializing...
                    </span>
                  ) : (
                    "Generate Project"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick prompts */}
          {!isLoading && prompt.length === 0 && (
            <div
              className="mt-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <QuickPrompts onSelect={handleQuickPromptSelect} />
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          className="mt-12 text-center text-sm text-slate-500 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <p>Projects are generated in 15-45 seconds • Powered by AI</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-30px, 30px) rotate(-5deg);
          }
          66% {
            transform: translate(20px, -20px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
