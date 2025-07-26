import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Plus } from "lucide-react";
import React from "react";
interface PageHeadePrrops {
  header: string;
  subText: string;
  button: boolean;
  buttonType?: "workspace" | "project";
}
const PageHeader = ({
  header,
  subText,
  button,
  buttonType,
}: PageHeadePrrops) => {
  return (
    <div className="flex justify-between items-center bg-[#1546E7] px-3 py-8">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-white font-bold text-2xl">{header}</h1>
        </div>
        <div className="text-white text-xs">{subText}</div>
      </div>
      <div>{button && <PageButton buttonType={buttonType} />}</div>
    </div>
  );
};

export default PageHeader;

interface PageButtonProps {
  buttonType?: "workspace" | "project";
}
const PageButton = ({ buttonType }: PageButtonProps) => {
  const { open: openProject } = useCreateProjectModal();
  const { open: openWorkspace } = useCreateWorkspaceModal();
  if (buttonType == "project") {
    return (
      <Button
        variant="secondary"
        className="rounded-[12px] text-[#1546E7] font-semibold text-[12px]"
        onClick={openProject}
      >
        <Plus /> <span>Create new project</span>
      </Button>
    );
  } else {
    return (
      <Button
        variant="secondary"
        className="rounded-[12px] text-[#1546E7] font-semibold text-[12px]"
        onClick={openWorkspace}
      >
        <Plus /> <span>Create new workspace</span>
      </Button>
    );
  }
};
