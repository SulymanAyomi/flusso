import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import React from "react";
import { useGetTaskactivities } from "../../api/use-get-task-activities";
import ActivitiesRow from "@/components/activities";

interface TaskActivitiesProps {
  taskId: string;
}
const TaskActivities = ({ taskId }: TaskActivitiesProps) => {
  const { data: activities, isLoading: isLoadingActivities } =
    useGetTaskactivities({ taskId });
  if (isLoadingActivities) {
    return "Loading...";
  }
  if (!activities || activities.length == 0) {
    return (
      <div className="flex flex-1 flex-col p-4 text-black">
        <p className="text-center">No activity</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4 text-black">
      <div>
        <div className="mb-3">
          <p>Today</p>
        </div>
        <div className="flex flex-col gap-4">
          <ActivitiesRow activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default TaskActivities;
