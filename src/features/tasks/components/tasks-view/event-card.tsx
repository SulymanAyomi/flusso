import { cn } from "@/lib/utils";
import { TaskStatus } from "../../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useTaskDetailsModal } from "../../hooks/use-task-details-modal";
import { TaskStatus as PrismaTaskStatus } from "@/generated/prisma";
import { useIsMobile } from "@/hooks/use-mobile";
import MemberDisplay from "@/features/members/components/member-display";

interface EventCardProps {
  title: string;
  assignedTo: {
    id: string;
    user: {
      name: string | null;
      email: string | null;
    };
  } | null;
  project: {
    name: string;
    id: string;
    imageUrl: string | null;
  };
  status: TaskStatus;
  id: string;
}
const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-green-500",
};
const statusColorMapMobile: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "bg-pink-500",
  [TaskStatus.TODO]: "bg-red-500",
  [TaskStatus.IN_PROGRESS]: "bg-yellow-500",
  [TaskStatus.IN_REVIEW]: "bg-blue-500",
  [TaskStatus.DONE]: "bg-green-500",
};
export const EventCard = ({
  title,
  assignedTo,
  project,
  status,
  id,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open: openTask } = useTaskDetailsModal();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openTask(id);
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        onClick={onClick}
        className={cn("p-1 rounded-sm", statusColorMapMobile[status])}
      >
        <p className="text-[10px] line-clamp-1">{title}</p>
      </div>
    );
  }

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status],
        )}
      >
        <p>{title}</p>
        <div className=" flex items-center gap-x-1">
          {<MemberDisplay assignedTo={assignedTo} />}
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl ?? ""} />
        </div>
      </div>
    </div>
  );
};
