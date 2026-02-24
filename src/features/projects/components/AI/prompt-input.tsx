import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaStop, FaArrowUp } from "react-icons/fa";
import { PromptSchema } from "../../schema";
import { useState } from "react";

interface PromptInputProps {
  initialPrompt: string;
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput = ({
  initialPrompt,
  onSubmitPrompt,
  isLoading,
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isFocused, setIsFocused] = useState(false);
  const charCount = prompt.length;
  const minChars = 10;
  const maxChars = 500;
  const isValidLength = charCount >= minChars && charCount <= maxChars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmitPrompt(prompt.trim());
    }
  };

  return (
    <div className="w-full">
      <form className="flex flex-1" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center px-2 py-4  w-full bg-neutral-100 rounded-md">
          <div className="flex items-center gap-1 w-full">
            <div
              className={`
                w-full relative backdrop-blur-xl rounded
                transition-all duration-500 ease-out
              
              `}
            >
              <Textarea
                rows={1}
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                placeholder="What would you like to build?"
                className="border-none shadow-none focus:border-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-neutral-100 focus:outline-none  break-words whitespace-pre-wrap overflow-hidden resize-none transition-all duration-300 disabled:cursor-not-allowed"
                style={{
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              />
            </div>
            <Button
              disabled={isLoading}
              className="flex justify-center items-center rounded-full  size-10 p-0"
            >
              {isLoading ? <FaStop /> : <FaArrowUp />}
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-slate-500">
              {charCount > 0 && (
                <span className={charCount > maxChars ? "text-red-500" : ""}>
                  {charCount} / {maxChars}
                </span>
              )}
            </div>

            {charCount > 0 && charCount < minChars && (
              <div className="text-xs text-amber-600">
                At least {minChars - charCount} more characters needed
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
