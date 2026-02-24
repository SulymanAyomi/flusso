import { Button } from "@/components/ui/button";
import { ArrowDownIcon, PencilIcon, RefreshCcw } from "lucide-react";
import { useProjectFlow } from "./useprojectflow";

const ActionButtons = ({}) => {
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
    openPanel,
    handleSave,
    handleRegenerate,
  } = useProjectFlow();
  return (
    <div className="w-full">
      {
        <div className="flex-shrink-0 px-8 py-6 bg-slate-50 border-t border-slate-200 w-full">
          <div className="flex gap-3 items-end justify-end w-full">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleRegenerate}
            >
              <RefreshCcw /> Regenerate
            </Button>
            <Button variant="outline" disabled={isLoading} onClick={openPanel}>
              <PencilIcon /> Edit
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <ArrowDownIcon /> Save Project
            </Button>
            <Button disabled={isLoading} onClick={reset}>
              <ArrowDownIcon /> Reset chat
            </Button>
          </div>
        </div>
      }
    </div>
  );
};

export default ActionButtons;
