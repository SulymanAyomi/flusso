"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEditTaskDependencies } from "../../api/use-edit-task-dependencies";

interface TaskDependencyProps {
  onCancel?: () => void;
  id: string;
  taskOptions?: { id: string; name: string }[];
  initDep: string[];
}

export const TaskDependency = ({
  onCancel,
  id,
  taskOptions,
  initDep,
}: TaskDependencyProps) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(initDep);
  const toggleTask = (task: string) => {
    setSelectedTasks((prev) => {
      return prev.includes(task)
        ? prev.filter((t) => t !== task)
        : [...prev, task];
    });
  };
  const { mutate, isPending, error } = useEditTaskDependencies();
  const onSubmit = () => {
    mutate(
      { json: { dependencies: selectedTasks }, param: { taskId: id } },
      {
        onSuccess: () => {
          onCancel?.();
        },
        onError(error, variables, context) {
          console.log("i am error", error);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full p-2.5 px-3 border-none shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <p className="text-xl font-bold">Edit Dependencies</p>
        </div>
      </div>
      <div className="mt-3 mb-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-0">
        <div className="bg-white p-1 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
          <div className="flex  gap-1 flex-col items-start justify-between gap-x-2">
            <p className="text-xs">
              Select tasks that must be completed before this one can be marked
              as complete.
            </p>
            {error && (
              <p className="text-[10px] text-red-500">
                One of the selected tasks already dependds on this task,
                creating a circular dependency.
              </p>
            )}
          </div>
          {/* <DottedSeparator /> */}
          <div className="border rounded-md min-h-4">
            <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
              {taskOptions?.map((task, index) => (
                <div
                  key={index}
                  className="flex gap-2  p-3 items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full"
                >
                  <label
                    key={task.id}
                    className="flex items-center cursor-pointer gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                    onClick={() => toggleTask(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()} // Prevent label click from triggering twice
                    />
                    <span>{task.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancle
            </Button>
            <Button
              disabled={isPending}
              variant="primary"
              onClick={() => onSubmit()}
            >
              Save changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
