"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpIcon,
  Calendar,
  CheckCircle2Icon,
  Clock,
  File,
  Image,
  Loader,
  Plus,
  PlusIcon,
  SmileIcon,
  Star,
  TagIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DatePicker } from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { createTaskSchema } from "../schema";
import { TaskStatus, TaskPriority } from "../types";
import { useCreateTask } from "../api/use-create-task";
import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-separator";
import { useState } from "react";
import { toast } from "sonner";
import { CreateTagForm } from "@/features/tags/components/create-tags-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface CreateTaskFormProps {
  onCancel: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}

export const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
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

  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      projectId,
      tags: [],
      subTask: [],
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    console.log("hello");
    setComments(commentInput);

    mutate(
      { json: { ...values, subTask, comment, tags: selectedTags } },
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
  const addComment = () => {
    // if (commentInput.trim() === "") {
    //   toast.error("Add a comment");

    //   return;
    // }
    // setComments(commentInput);
    console.log("hello");
  };

  return (
    <div className="bg-white p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <p className="text-xl font-bold">Create Task</p>
        </div>
      </div>
      {/* <Separator className="bg-neutral-300" /> */}
      <div className="mt-3 mb-6">
        <DottedSeparator />
      </div>
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

          <div className="flex flex-col gap-4 text-black text-xs pt-2">
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
                        <SelectTrigger
                          className={cn(
                            field.value == undefined
                              ? "text-neutral-400"
                              : "text-black"
                          )}
                        >
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
                        <SelectTrigger
                          className={cn(
                            field.value == undefined
                              ? "text-neutral-400"
                              : "text-black"
                          )}
                        >
                          <SelectValue placeholder="Select priority" />
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
                      <DatePicker {...field} className="h-9 rounded-md gap-1" />
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
                      <DatePicker {...field} className="h-9 rounded-md gap-1" />
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
                <FormItem className="flex items-center w-full">
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
                        <SelectTrigger
                          className={cn(
                            field.value == undefined
                              ? "text-neutral-400"
                              : "text-black"
                          )}
                        >
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
              <div className="flex w-[25%] gap-1">
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

            <div className="flex items-center w-full">
              {
                <div className="flex flex-1 flex-col">
                  <p className="text-black text-sm font-bold mb-2  p-3">
                    Sub Task
                  </p>
                  {subTask.map((task, index) => (
                    <div
                      key={index}
                      className="flex gap-2  p-3 items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full"
                    >
                      <Checkbox />
                      <p>{task}</p>
                    </div>
                  ))}
                  <div
                    className="flex gap-2 p-3 text-black items-center justify-start py-2 rounded-md hover:bg-primary-foreground w-full cursor-pointer"
                    onClick={() => setShowInput(!showInput)}
                  >
                    <Plus /> <p className="text-black">Add subtasks item</p>
                  </div>
                  {showInput && (
                    <div className="flex flex-col p-3 gap-2 text-black items-start justify-start py-2 rounded-md hover:bg-primary-foreground w-full cursor-pointer">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add subtask"
                        className="h-8 bg-white border w-1/2 text-[10px] py-2 px-3 focus-visible:border"
                      />
                      <Button
                        onClick={(e) => {
                          e.preventDefault();

                          addSubItem();
                        }}
                        className="bg-blue-900 text-white py-1 px-4 text-xs h-fit rounded-md font-normal hover:bg-blue-900/80 "
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              }
            </div>
            <div className="flex flex-col relative">
              <Textarea
                placeholder="Add a Comment"
                className="text-[10px] min-h-[100px] text-black"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <div className="absolute bottom-0 p-2 right-0 left-0">
                <div className="flex items-center justify-between">
                  <div>
                    {/* <Button
                      className="text-xs w-fit h-fit px-3 py-2 bg-blue-700 text-white bottom-0"
                      onClick={(e) => {
                        e.preventDefault();
                        addComment();
                      }}
                    >
                      Comment
                    </Button> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="size-4" />
                    <SmileIcon className="size-4" />
                    <Image className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancle
            </Button>
            <Button disabled={isPending} variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
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
