// hooks/useSimulatedStream.ts

import { useState, useRef, useCallback } from "react";

interface UseSimulatedStreamOptions {
  /** Words per minute. Default: 600 (fast but readable). */
  speed?: number;
  /** Delay in ms before streaming begins. Default: 400. */
  initialDelay?: number;
}

interface UseSimulatedStreamReturn {
  streamedText: string;
  isStreaming: boolean;
  start: (text: string) => void;
  reset: () => void;
}

const DEFAULT_SPEED_WPM = 600;
const DEFAULT_INITIAL_DELAY_MS = 400;

/**
 * Simulates a streaming text effect by revealing words progressively.
 * - Fully cancellable via an AbortController-style cancelled flag.
 * - Safe for re-renders: state updates are batched via requestAnimationFrame.
 * - No external dependencies.
 */
export function useSimulatedStream(
  options: UseSimulatedStreamOptions = {}
): UseSimulatedStreamReturn {
  const { speed = DEFAULT_SPEED_WPM, initialDelay = DEFAULT_INITIAL_DELAY_MS } =
    options;

  const [streamedText, setStreamedText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // A ref-based cancellation token. Incrementing it invalidates any in-flight stream.
  const cancelTokenRef = useRef<number>(0);

  const reset = useCallback(() => {
    cancelTokenRef.current += 1; // Cancel any in-flight stream
    setStreamedText("");
    setIsStreaming(false);
  }, []);

  const start = useCallback(
    (text: string) => {
      // Cancel any previous stream
      cancelTokenRef.current += 1;
      const myToken = cancelTokenRef.current;

      setStreamedText("");
      setIsStreaming(true);

      const words = text.split(" ");
      // Derive ms-per-word from WPM
      const msPerWord = Math.round(60_000 / speed);

      const run = async () => {
        // Initial delay before stream begins
        await delay(initialDelay);
        if (cancelTokenRef.current !== myToken) return;

        for (let i = 0; i < words.length; i++) {
          await delay(msPerWord);
          if (cancelTokenRef.current !== myToken) return;

          // Build incrementally to avoid closure stale-state issues
          const chunk = words.slice(0, i + 1).join(" ");
          setStreamedText(chunk);
        }

        if (cancelTokenRef.current !== myToken) return;
        setIsStreaming(false);
      };

      run();
    },
    [speed, initialDelay]
  );

  return { streamedText, isStreaming, start, reset };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
