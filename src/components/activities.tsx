import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format } from "date-fns";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { ActivityType } from "@/generated/prisma";

interface ActivityInterface {
  member: {
    user: {
      name: string | null;
      imageUrl: string | null;
    };
  };
  metadata: any;
  id: string;
  createdAt: Date | string;
  workspaceId: string;
  memberId: string;
  actionType: ActivityType;
  entityType: string | null;
  entityId: string | null;
  entityTitle: string | null;
}

const renderActivityText = ({
  member,
  actionType,
  entityTitle,
  createdAt,
  metadata,
}: ActivityInterface) => {
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
            <Bold>{`${entityTitle}`}</Bold> status from{" "}
            {metadata?.previousValue} to {metadata?.newValue}
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
            <Bold>{`${entityTitle}`}</Bold> status from{" "}
            {metadata?.previousValue} to {metadata.newValue}
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
  activities: ActivityInterface[];
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
