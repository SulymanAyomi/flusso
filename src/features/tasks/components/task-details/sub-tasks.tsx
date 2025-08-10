import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useGetSubTasks } from "../../api/use-get-subtasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSubTask } from "../../api/use-create-subtask";
import { cn } from "@/lib/utils";
import { useEditSubTask } from "../../api/use-edit-subtask";
import { useDeleteSubTask } from "../../api/use-delete-subtask";

interface subTasksProps {
  taskId: string;
}
const SubTasks = ({ taskId }: subTasksProps) => {
  const { data: subTasks, isLoading } = useGetSubTasks({ taskId });
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [subTask, setSubTask] = useState<{ name: string; isDone: boolean }[]>(
    []
  );
  const [savedIds, setSavedIds] = useState<string[]>([]);
  //   const addSubItem = () => {
  //     if (input.trim() === "") {
  //       return;
  //     }

  //     setInput("");
  //   };

  const { mutate, isPending } = useCreateSubTask();
  const {
    mutate: EditTaskMutate,
    isPending: isPendingEdit,
    variables,
  } = useEditSubTask();
  const { mutate: deleteSubTask } = useDeleteSubTask();

  const submit = () => {
    if (input.trim() === "") return;
    const sub = {
      name: input,
      isDone: false,
    };
    mutate(
      { json: sub, param: { taskId } },
      {
        onSuccess: () => {
          setInput("");
        },
      }
    );
  };
  const changeStatus = ({ id, isDone }: { id: string; isDone: boolean }) => {
    const sub = {
      id,
      isDone,
    };
    EditTaskMutate(
      { json: sub, param: { taskId } },
      {
        onSuccess: ({ data }) => {
          setSavedIds((prev) => [...prev, data.id]);
          setTimeout(() => {
            setSavedIds((prev) => prev.filter((id) => id !== data.id));
          }, 1000);
        },
      }
    );
  };
  const onDelete = ({ id, isDone }: { id: string; isDone: boolean }) => {
    const sub = {
      id,
      isDone,
    };
    deleteSubTask(
      { json: sub, param: { taskId } },
      {
        onSuccess: () => {
          setSavedIds((prev) => prev.filter((id) => id !== data.id));
        },
      }
    );
  };

  if (isLoading) {
    return "Loading...";
  }
  return (
    <div className="flex flex-1 flex-col p-4">
      <div>
        {subTasks && subTasks.length > 0 ? (
          subTasks?.map((task) => (
            <div
              className="flex  gap-2  items-center justify-between py-2 rounded-md  w-full"
              key={task.id}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => {
                    changeStatus({ id: task.id, isDone: !task.isDone });
                  }}
                  disabled={isPendingEdit && variables.json.id === task.id}
                  className="h-4 w-4 cursor-pointer"
                />
                <p
                  className={cn(
                    !task.isDone && "text-black",
                    task.isDone && "line-through text-gray-500"
                  )}
                >
                  {task.name}
                </p>{" "}
              </div>
              <div className="hover:bg-primary-foreground flex items-center">
                {savedIds.includes(task.id) && (
                  <div className="flex items-center text-sm animate-fade-in-out">
                    <CheckIcon className="size-4 text-green-500 mr-1 " />
                    <span className="text-[8px]">Saved</span>
                  </div>
                )}
                <div
                  className="p-1 hover:bg-primary-foreground cursor-pointer"
                  onClick={() => onDelete({ id: task.id, isDone: task.isDone })}
                >
                  <XIcon className="text-red-400 size-4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="ml-1 text-black">
            No subtask. You can create subtasks for this task.
          </p>
        )}

        <div
          className="flex gap-2 py-3 text-black items-center justify-start rounded-md hover:bg-primary-foreground w-full cursor-pointer"
          onClick={() => setShowInput(!showInput)}
        >
          <PlusIcon /> <p className="text-black">Add subtasks item</p>
        </div>
        {showInput && (
          <div className="flex flex-col p-3 gap-2 text-black items-start justify-start py-2 rounded-md hover:bg-primary-foreground w-full cursor-pointer">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add subtask"
              className="h-8 bg-white border w-full text-[10px] py-2 px-3 focus-visible:border"
            />
            <Button
              disabled={isPending}
              onClick={() => submit()}
              className="bg-blue-900 text-white text-center w-full py-1 px-4 text-xs h-fit rounded-md font-normal hover:bg-blue-900/80 "
            >
              {isPending ? "Saving subtask" : "Add subtask"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTasks;
