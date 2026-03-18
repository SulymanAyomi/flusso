"use client";

import PageHeader from "@/components/page-header";
import { MyTaskAnalytics } from "@/components/my-task-components/analytics";
import { TaskViewSwitcher } from "@/features/tasks/components/my-task/task-view-switcher";

export const MyTaskClient = () => {
  return (
    <div className="flex flex-col">
      <PageHeader
        header="Welcome, Ayomi"
        subText="Start to manage your workspaces and their projects here"
        button={true}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">My Tasks</h2>
      </div>
      {/* Body */}
      <div className="px-3 space-y-3 w-full bg-neutral-100">
        {/* workspce overview cards */}
        <MyTaskAnalytics />
        <div className="grid grid-cols-1 py-2 gap-2">
          {/* <MyTaskSegmentation /> */}
          <div className="bg-white rounded-md p-4">
            <TaskViewSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};
