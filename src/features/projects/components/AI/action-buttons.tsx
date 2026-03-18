import { Button } from "@/components/ui/button";
import { ArrowDownIcon, PencilIcon, RefreshCcw } from "lucide-react";
import { useProjectFlow } from "./useprojectflow";

interface ActionButtonProps {
  onSave: () => void;
  onOpen: () => void;
  onRegenerate: () => void;
  onDiscard: () => void;
  isLoading: boolean;
}
const ActionButtons = ({
  onSave,
  onRegenerate,
  onDiscard,
  isLoading,
  onOpen,
}: ActionButtonProps) => {
  return (
    <div className="w-full">
      {
        <div className="flex-shrink-0 px-8 py-6 bg-slate-50 border-t border-slate-200 w-full">
          <div className="flex gap-3 items-end justify-end w-full">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={onRegenerate}
            >
              <RefreshCcw /> Regenerate
            </Button>
            <Button variant="outline" disabled={isLoading} onClick={onOpen}>
              <PencilIcon /> Edit
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              <ArrowDownIcon /> Save Project
            </Button>
            <Button disabled={isLoading} onClick={onDiscard}>
              <ArrowDownIcon /> Reset chat
            </Button>
          </div>
        </div>
      }
    </div>
  );
};

export default ActionButtons;
