import { TaskActions } from "@/features/tasks/components/task-actions";
import { TasksType } from "@/features/tasks/types";
import {
  CalendarDaysIcon,
  Link2Icon,
  ListCheckIcon,
  MessagesSquareIcon,
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
import { useGetTasksResponseType } from "@/features/tasks/api/use-get-tasks";
import MemberDisplay from "@/features/members/components/member-display";

interface KanbanCardProps {
  task: TasksType;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const totalSubtask = task.Subtask.length;
  const isDoneSubtask = task.Subtask.filter((t) => t.isDone).length;
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-1 font-semibold truncate">
          {task.name}
        </p>
        <TaskActions id={task.id}>
          <MoreVerticalIcon className="size-[18-px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div>
        <p className="line-clamp-2 text-xs text-gray-700 truncate ">
          {task.description}
        </p>
      </div>
      <div className="flex items-center gap-x-1.5 justify-between text-xs text-gray-700">
        <p>Assignees:</p>
        <div className="flex flex-row-reverse">
          {/* {task.assignedTo && (
            <MemberAvatar
              name={task.assignedTo?.user.name!}
              className="ml-[-12px] size-6 bg-brand1"
            />
          )} */}
          <MemberDisplay
            assignedTo={task.assignedTo}
            className="ml-[-12px] size-6"
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center">
          <CalendarDaysIcon className="size-4 gap-1" />
          <p className="text-[10px] ml-1">
            {format(new Date(task.dueDate!), "MMM d, yyyy")}{" "}
          </p>
        </div>
        <Badge variant={task.priority} className="text-[10px] px-1 py-0.5">
          {snakeCaseToTitleCase(task.priority)}
        </Badge>
      </div>
      <DottedSeparator />
      <div className="flex items-center justify-between gap-1 text-xs text-gray-700">
        <div className="flex items-center gap-1">
          <p>{task.Comment.length}</p>
          <MessagesSquareIcon className="size-4 " />
        </div>
        <div className="flex items-center gap-1">
          <Link2Icon className="size-4" />
          <p>{task.blockedBy?.length}</p>
          {/* depends on 2 tasks */}
        </div>
        <div className="flex items-center">
          <p>
            {isDoneSubtask}/{totalSubtask}
          </p>
          <ListCheckIcon className="size-4" />
        </div>
      </div>
    </div>
  );
};
