import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useGetWorkspaceActivities } from "@/features/workspaces/api/use-get-workspace-activities";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { format } from "date-fns";
import { snakeCaseToTitleCase } from "@/lib/utils";

const Activities = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceActivities({ workspaceId });

  return (
    <Card className="flex min-h-60 flex-col">
      <CardHeader>
        <h3 className="text-[18px] font-semibold">Activity</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full h-full">
        {isLoading ? (
          <ActivityLoader />
        ) : data?.summary.total && data?.summary.total > 0 ? (
          <ActivityFeed activities={data?.activities} />
        ) : (
          <div className="text-center my-auto flex flex-col items-center justify-center h-full w-full text-sm">
            <p className="text-sm text-center">
              No activity recorded this week.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Activities;

const ActivityLoader = () => (
  <div className="space-y-2 w-full">
    {[...Array(5)].map(() => (
      <div className="flex justify-start items-center gap-2 w-full">
        <div className="flex items-center justify-center">
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div className="flex justify-start items-center w-full">
          <Skeleton className="w-full h-4 mr-2" />
          <Skeleton className="w-8 h-6" />
        </div>
      </div>
    ))}
  </div>
);

type Activity = {
  id: string;
  createdAt: Date | string;
  actionType: string;
  entityType: string | null;
  entityId: string | null;
  entityTitle: string | null;
  metadata: any;
  member: {
    id: string;
    user: {
      name: string | null;
      id: string;
      imageUrl: string | null;
    };
    role: any;
  };
};

const renderActivityText = (activity: Activity) => {
  const { member, actionType, entityTitle, createdAt, metadata } = activity;

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
          </div>{" "}
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
            to {metadata.newValue}
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

type Props = {
  activities: Activity[];
};

export const ActivityFeed: React.FC<Props> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex justify-start items-center gap-2"
        >
          <div className="flex items-center justify-center">
            <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
              <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                A
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-between items-center flex-1">
            {renderActivityText(activity)}
          </div>
        </div>
      ))}
    </div>
  );
};

{
  /* <div className="flex justify-start items-center gap-2">
  <div className="flex items-center justify-center">
    <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
      <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
        A
      </AvatarFallback>
    </Avatar>
  </div>
  <div className="flex justify-start">
    <div className="text-xs">
      <strong>Damilola</strong> changed the status of task{" "}
      <strong>"web design"</strong> from{" "}
      <span className="font-semibold">in progress</span> to{" "}
      <span className="font-semibold">complete</span>
    </div>
    <div className="text-[10px]">May 30, 10:23pm</div>
  </div>
</div>; */
}
