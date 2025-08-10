"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { createTaskSchema } from "../../schema";
import { EditTask, Task, TaskStatus } from "../../types";
import { useEditTask } from "../../api/use-edit-task";
import {
  ArrowUpIcon,
  Calendar,
  CheckCircle2Icon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  Loader,
  Plus,
  PlusIcon,
  SmileIcon,
  TagIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { TaskPriority } from "@/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string | null }[];
  memberOptions: { id: string; name: string }[];
  initialValues: EditTask;
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [subTask, setSubTask] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [comment, setComments] = useState("");
  const [allTags, setAllTags] = useState<string[]>([
    "management",
    "online tools",
    "review",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev: string[]) => {
      return prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
    });
  };

  const { mutate, isPending } = useEditTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      name: initialValues.name,
      workspaceId: initialValues.workspaceId,
      projectId: initialValues.projectId,
      assignedToId: initialValues.assignedToId ?? undefined,
      description: initialValues.description ?? "",
      // comment: initialValues.comment,
      subTask: [],
      tags: [],
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      startDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      status: initialValues.status,
      priority: initialValues.priority,
      dependencies: [],
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  const addSubItem = () => {
    if (input.trim() === "") {
      return;
    }
    setSubTask((prev) => [...prev, input.trim()]);
    setInput("");
  };

  return (
    <Card className="w-full h-full p-2.5 px-3 border-none shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <p className="text-xl font-bold">Edit Task</p>
        </div>
      </div>
      <div className="mt-3 mb-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="w-full">
                      <Input
                        {...field}
                        placeholder="Task Name"
                        className="text-lg px-2 py-1 w-full border rounded-md"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <div className="flex flex-col gap-4 text-neutral-400 text-xs pt-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex items-center text-black  w-[25%] gap-1">
                      <Loader className="size-5 text-neutral-700" />
                      <p>Status</p>
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex-1 text-sm">
                        <FormControl className="w-1/2">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="">
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskStatus.BACKLOG}
                          >
                            Backlog
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskStatus.IN_PROGRESS}
                          >
                            In Progress
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskStatus.IN_REVIEW}
                          >
                            In Review
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskStatus.TODO}
                          >
                            Todo
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskStatus.DONE}
                          >
                            Done
                          </SelectItem>
                        </SelectContent>
                      </div>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex text-black w-[25%] items-center gap-1">
                      <CheckCircle2Icon className="size-5 text-neutral-700" />
                      <p>Priority</p>
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex-1 text-sm">
                        <FormControl className="w-1/2">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="">
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskPriority.HIGH}
                          >
                            High
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskPriority.MEDIUM}
                          >
                            Medium
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskPriority.LOW}
                          >
                            Low
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={TaskPriority.CRITICAL}
                          >
                            Critical
                          </SelectItem>
                        </SelectContent>
                      </div>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex items-center text-black w-[25%] gap-1">
                      <Calendar className="size-5 text-neutral-700" />
                      <p>Start date</p>
                    </FormLabel>
                    <div className="flex-1 text-sm">
                      <FormControl className="w-1/2">
                        <DatePicker
                          {...field}
                          className="h-9 rounded-md gap-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex items-center text-black w-[25%] gap-1">
                      <Calendar className="size-5 text-neutral-700" />
                      <p>Due Date</p>
                    </FormLabel>
                    <div className="flex-1 text-sm">
                      <FormControl className="w-1/2">
                        <DatePicker
                          {...field}
                          className="h-9 rounded-md gap-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex text-black w-[25%] gap-1">
                      <UsersIcon className="size-5 text-neutral-700" />
                      <p>Assignees</p>
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex-1 text-sm">
                        <FormControl className="w-1/2">
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  className="size-6"
                                  name={member.name}
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </div>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex items-center w-full">
                <div className="flex w-[25%] gap-1 text-black">
                  <TagIcon className="size-5 text-neutral-400" />
                  <p>Tags</p>
                </div>
                <div className="flex-1 flex gap-1 items-center justify-items-start flex-wrap">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="p-1 h-full w-fit bg-neutral-200 text-black rounded-full text-[10px]">
                        <PlusIcon className="size-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px]">
                      <AddTags
                        allTags={allTags}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        toggleTag={toggleTag}
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[12px] flex gap-1 items-center"
                    >
                      {tag}
                      <span
                        onClick={() => toggleTag(tag)}
                        className="text-black bg-blue-500 rounded-full p-[2px]"
                      >
                        <XIcon className="size-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex w-full  flex-col p-3 rounded-[12px]">
                    <FormLabel>
                      <p className="text-black font-semibold text-sm mb-2">
                        Description
                      </p>
                    </FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Textarea
                          {...field}
                          placeholder="Task Description"
                          className=" px-2 py-1 w-full border rounded-md text-black min-h-[70px]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button variant="outline" onClick={onCancel}>
                Cancle
              </Button>
              <Button disabled={isPending} variant="primary">
                Save Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

interface AddTagsProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tags: string) => void;
}
const AddTags = ({
  allTags,
  selectedTags,
  setSelectedTags,
  toggleTag,
}: AddTagsProps) => {
  const [newTag, setNewTag] = useState("");
  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setNewTag("");
    }
  };

  return (
    <div className="bg-white p-2.5 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2 font-semibold">Select Tags</p>
        {/* <div>
          <XIcon className="size-5" />
        </div> */}
      </div>
      {/* <DottedSeparator /> */}
      <div className="border rounded-md h-32">
        <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
          {allTags.map((tag, index) => (
            <div
              key={index}
              onClick={() => toggleTag(tag)}
              className={cn(
                "p-1 px-2  rounded-[12px] text-[10px] cursor-pointer",
                selectedTags.includes(tag)
                  ? "bg-blue-200 text-blue-800"
                  : "bg-neutral-200 border-gray-300"
              )}
            >
              {tag}
            </div>
          ))}
          <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
            UI design
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1.5 justify-between text-xs text-gray-700 relative">
        <Input
          placeholder="Add new tag"
          className="w-full px-2 h-10 pr-[50px]"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button
          className="flex justify-center items-center absolute h-full right-0"
          onClick={(e) => {
            e.preventDefault();
            handleAddTag();
          }}
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
};

interface TaskDependencyProps {
  taskOptions?: { id: string; name: string }[];
  selectedTask: { id: string; name: string }[];
  toggleTask: (task: { id: string; name: string }) => void;
}

const TaskDependency = ({
  taskOptions,
  selectedTask,
  toggleTask,
}: TaskDependencyProps) => {
  return (
    <div className="bg-white p-1 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-[10px]">
          Select tasks that must be completed before this one can be marked as
          complete.
        </p>
      </div>
      {/* <DottedSeparator /> */}
      <div className="border rounded-md min-h-4">
        <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
          {taskOptions?.map((task, index) => (
            <div
              key={index}
              onClick={() => toggleTask(task)}
              className={cn(
                "p-1 px-2  rounded-[12px] text-[10px] cursor-pointer",
                selectedTask.includes(task)
                  ? "bg-blue-200 text-blue-800"
                  : "bg-neutral-200 border-gray-300"
              )}
            >
              {task.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
