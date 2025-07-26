import { TaskActions } from "@/features/tasks/components/task-actions";
import { EditTask, Task } from "@/features/tasks/types";
import {
  CalendarDaysIcon,
  Link2Icon,
  MoreHorizontal,
  MoreVerticalIcon,
  NotepadText,
  NotepadTextDashedIcon,
} from "lucide-react";
import { DottedSeparator } from "./dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "@/features/tasks/components/task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { format } from "date-fns";

interface KanbanCardProps {
  task: EditTask;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2 font-semibold">{task.name}</p>
        <TaskActions id={task.id}>
          <MoreVerticalIcon className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div>
        <p className="line-clamp-2 text-xs text-gray-700">{task.description}</p>
      </div>
      <div className="flex items-center gap-x-1.5 justify-between text-xs text-gray-700">
        <p>Assignees:</p>
        <div className="flex flex-row-reverse">
          <MemberAvatar
            name={task.assignedTo?.user.name!}
            className="ml-[-12px] size-6 bg-brand1"
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center">
          <CalendarDaysIcon className="size-4 gap-1" />
          <p className="text-[10px] ml-1">
            {format(task.dueDate!, "MMM d, yyyy")}{" "}
          </p>
        </div>
        <Badge variant={task.priority} className="text-[10px] px-1 py-0.5">
          {snakeCaseToTitleCase(task.priority)}
        </Badge>
      </div>
      <DottedSeparator />
      <div className="flex items-center justify-between gap-1 text-xs text-gray-700">
        <div className="flex items-center gap-1">
          <p>12</p>
          <NotepadText className="size-4 " />
        </div>
        <div className="flex items-center">
          <p>2</p>
          <Link2Icon className="size-4" />
        </div>
        <div className="flex items-center">
          <p>4</p>
          <NotepadTextDashedIcon className="size-4" />
        </div>
      </div>
    </div>
  );
};
