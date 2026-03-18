// components/ChatMessage.tsx
"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSimulatedStream } from "../demo/useSimulatedStream";
import { formatProjectNarrative } from "./formatProjectNarrative";
import type { ProjectJson } from "../demo/project";
import { ErrorAction, ProjectData } from "../../types";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  LinkIcon,
  RefreshCcw,
  SaveIcon,
} from "lucide-react";
import ActionButtons from "./action-buttons";

interface AIChatMessageProps {
  /** The structured project JSON returned by the backend. */
  project: ProjectData;
  /** Called once when the simulated stream finishes. Use to open the preview panel. */
  onStreamComplete?: (project: ProjectData) => void;
  /** Optional override for words-per-minute. */
  speed?: number;
  actions: ErrorAction[];
  onRegenerate: () => void;
}

/**
 * Renders a single AI chat bubble that streams a project narrative.
 * Logic (formatting + streaming) is fully separated from presentation.
 */
export function AIChatMessage({
  project,
  onStreamComplete,
  speed,
  actions,
  onRegenerate,
}: AIChatMessageProps) {
  const { streamedText, isStreaming, start, reset } = useSimulatedStream({
    speed,
    initialDelay: 400,
  });

  // Stable ref to avoid stale closure in the effect
  const onStreamCompleteRef = useRef(onStreamComplete);
  onStreamCompleteRef.current = onStreamComplete;

  const projectRef = useRef(project);
  projectRef.current = project;

  useEffect(() => {
    const narrative = formatProjectNarrative(project);
    start(narrative);

    return () => {
      reset(); // Cancel stream if component unmounts mid-stream
    };
    // Only re-run if the project id changes (new project received)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.project.name]);

  // Fire callback exactly once when streaming transitions false → done
  const prevIsStreamingRef = useRef<boolean>(false);
  useEffect(() => {
    if (prevIsStreamingRef.current && !isStreaming && streamedText.length > 0) {
      onStreamCompleteRef.current?.(projectRef.current);
    }
    prevIsStreamingRef.current = isStreaming;
  }, [isStreaming, streamedText]);

  return (
    <div className="flex items-start gap-3 max-w-2xl w-full">
      {/* Bubble */}
      <div className="relative bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm w-full">
        {/* Markdown content */}
        <div className="prose prose-sm prose-slate max-w-none text-slate-800">
          {streamedText ? (
            <ReactMarkdown
              components={{
                li: ({ children }) => (
                  <li className="my-3 leading-7 pl-2">{children}</li>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal">{children}</ol>
                ),
                hr: () => <hr className="my-6 border-gray-200" />,
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2">{children}</h1>
                ),
                p: ({ children }) => <p className="mb-2">{children}</p>,
              }}
            >
              {streamedText}
            </ReactMarkdown>
          ) : (
            /* Loading dots shown before first word appears */
            <TypingIndicator />
          )}
        </div>
        <div className="flex gap-4 ">
          {!isStreaming &&
            streamedText.length > 0 &&
            actions.map((action) => (
              <Button
                variant={action.variant || "primary"}
                size="sm"
                onClick={() => {
                  action.label == "Regenerate"
                    ? onRegenerate()
                    : action.onClick();
                }}
                className="rounded-xl text-xs font-medium min-w-[100px]"
              >
                {ButtonIcon(action.label)}
                {action.label}
              </Button>
            ))}
        </div>

        {/* Blinking cursor while streaming */}
        {/* {isStreaming && streamedText && (
          <span
            aria-hidden
            className="inline-block w-0.5 h-4 bg-slate-600 ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]"
          />
        )} */}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center h-5" aria-label="Loading">
      {[0, 160, 320].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
        />
      ))}
    </div>
  );
}

function ButtonIcon(label: string) {
  if (label == "Regenerate") {
    return <RefreshCcw />;
  }
  if (label == "Open") {
    return <ArrowRightIcon />;
  }
  return <ArrowDownIcon />;
}
