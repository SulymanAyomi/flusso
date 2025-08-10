import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format } from "date-fns";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { GetTaskResponseActivitiesType } from "@/features/tasks/api/use-get-task-activities";

type Activity = GetTaskResponseActivitiesType["data"]["activities"][0];

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const activitySentences: Record<string, (a: Activity) => string> = {
  joined_workspace: (a) =>
    ` <div className="flex justify-start">
        <div className="text-xs">
              <span className="font-semibold">${
                a.member.user.name
              }</span> joined the workspace on 
            </div>
            <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
    </div>
    `,

  left_workspace: (a) =>
    ` <div className="flex justify-start">
        <div className="text-xs">
              <span className="font-semibold">${
                a.member.user.name
              }</span> left workspace on 
          </div>
      <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
    </div>
    `,

  created_project: (a) =>
    ` <div className="flex justify-start">
        <div className="text-xs">
              <span className="font-semibold">${
                a.member.user.name
              }</span> left workspace on 
          </div>
      <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
    </div>
    `,

  updated_project_status: (a) =>
    ` <div className="flex justify-start">
        <div className="text-xs">
              <span className="font-semibold">${a.member.user.name}</span>  updated project "${a.entityTitle}" status from ${a.previousValue} to ${a.newValue} on
          </div>
    </div>
    `,
  completed_project: (a) =>
    `<div className="flex justify-start">
        <div className="text-xs">
         <strong>${a.member.user.name}</strong> marked project "${
      a.entityTitle
    }" as completed on
        </div> 
      <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
</div>`,

  extended_project_end_date: (a) =>
    `
    <div className="flex justify-start">
        <div className="text-xs">
       <strong>${a.member.user.name}</strong> extended project "${
      a.entityTitle
    }" end date to ${a.newValue} on </div> 
     <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
    </div>
    `,

  deleted_project: (a) =>
    `
  <div className="flex justify-start">
        <div className="text-xs">
  <strong>${a.member.user.name}</strong> deleted project "${a.entityTitle}" on 
    </div>
         <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
</div>
    `,

  created_task: (a) =>
    `<strong>${a.member.name}</strong> created task "${
      a.entityTitle
    }" on ${formatDate(a.createdAt)}`,

  updated_task_status: (a) =>
    ` <div className="flex justify-start">
        <div className="text-xs">
        <strong>${a.member.user.name}</strong> updated task "${
      a.entityTitle
    }" from ${a.previousValue} to ${a.newValue} on 
    </div>
       <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
</div>
    `,

  assigned_task: (a) =>
    `<strong>${a.member.name}</strong> assigned task "${a.entityTitle}" to ${
      a.newValue
    } on ${formatDate(a.createdAt)}`,

  deleted_task: (a) =>
    `<strong>${a.member.name}</strong> deleted task "${
      a.entityTitle
    }" on ${formatDate(a.createdAt)}`,

  commented_task: (a) =>
    `<strong>${a.member.name}</strong> commented on task "${
      a.entityTitle
    }" on ${formatDate(a.createdAt)}`,

  added_attachment: (a) =>
    `<strong>${a.member.name}</strong> added an attachment to task "${
      a.entityTitle
    }" on ${formatDate(a.createdAt)}`,

  default: (a) =>
    `
    <div className="flex justify-start">
      <div className="text-xs text-blue-400">
        <strong>${a.member.user.name}</strong> performed action "${a.action}" on
      </div>
      <div className="text-[10px]">${formatDate(a.createdAt)}</div>   
    </div>
           `,
};

const renderActivityText = ({
  member,
  actionType,
  entityTitle,
  createdAt,
  metadata,
}: Activity) => {
  const Bold = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">{children}</span>
  );

  switch (actionType) {
    case "JOINED_WORKSPACE":
      return (
        <>
          <div className="text-xs ">
            <Bold>{member.user.name}</Bold> joined workspace
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "LEFT_WORKSPACE":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> left workspace
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>{" "}
        </>
      );

    case "PROJECT_CREATED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> created project{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "PROJECT_STATUS_UPDATED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> change project{" "}
            <Bold>{`${entityTitle}`}</Bold> status from {metadata.previousValue}{" "}
            to {metadata?.newValue}
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "PROJECT_COMPLETED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> mark project{" "}
            <Bold>{`${entityTitle}`}</Bold> as completed
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "PROJECT_EDITED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> edited project{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "TASK_CREATED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> created task{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "TASK_STATUS_UPDATED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> change task{" "}
            <Bold>{`${entityTitle}`}</Bold> status from {metadata.previousValue}{" "}
            to {metadata.newValue}
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "TASK_ASSIGNED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> assigned task{" "}
            <Bold>{`${entityTitle}`}</Bold> to {metadata.newAssignee}
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "TASK_EDITED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> edit task{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "COMMENT_ADDED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> added a new comment on task{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
    case "SUBTASK_ADDED":
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> added a new subtask to task{" "}
            <Bold>{`${entityTitle}`}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );

    default:
      return (
        <>
          <div className="text-xs">
            <Bold>{member.user.name}</Bold> performed{" "}
            <Bold>{snakeCaseToTitleCase(actionType)}</Bold>
          </div>
          <div className="text-[10px] flex flex-col">
            <p>{format(createdAt, "PP")},</p>
            <p>{format(createdAt, "p")}</p>
          </div>
        </>
      );
  }
};

type ActivitiesProps = {
  activities: GetTaskResponseActivitiesType["data"]["activities"];
};

const ActivitiesRow = ({ activities }: ActivitiesProps) => {
  if (!activities || activities.length < 1) {
    return <p>No activities</p>;
  }
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex justify-start items-center gap-2"
        >
          <div className="flex items-center justify-center">
            <MemberAvatar
              className="size-8 hover:opacity-75 transition border border-neutral-300"
              name="Ayomi"
            />
          </div>
          <div className="flex justify-between items-center flex-1">
            {renderActivityText(activity)}
          </div>
        </div>
      ))}
    </div>
  );
};
export default ActivitiesRow;
