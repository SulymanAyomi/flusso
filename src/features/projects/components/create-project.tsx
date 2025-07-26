"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, File, ImageIcon, Loader, Star } from "lucide-react";
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

import { createProjectSchema } from "../schema";
import { useRouter } from "next/navigation";
import { ProjectsStatus } from "../types";
import { useCreateProject } from "../api/use-create-project";
import Image from "next/image";
import { useRef } from "react";
import { Input } from "@/components/ui/input";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

function CreateProject({ onCancel }: CreateProjectFormProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const { mutate, isPending } = useCreateProject();
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      workspaceId,
      tags: [],
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      // image: values.image instanceof File ? values.image : "",
      image: "",
    };
    mutate(
      { json: finalValues },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <div className="bg-white w-[500px] p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start text-sm">
          <Star className="size-[18-px] stroke-1 shrink-0 text-blue-400 hover:opacity-75 transition" />
          <p className="text-xl font-bold">Create Project</p>
        </div>
      </div>
      <Separator className="bg-neutral-300 mb-2" />

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
                      placeholder="Project Name"
                      className="focus-visible:ring-blue-500 focus-visible:border-none text-lg px-2 py-1 w-full border rounded-md"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="flex flex-col gap-4 text-xs pt-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center w-full space-y-0">
                  <FormLabel className="flex items-center  w-[25%] gap-1">
                    <Loader className="size-5 text-neutral-400" />
                    <p>Status</p>
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex-1 text-sm">
                      <FormControl className="w-1/2">
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select status"
                            // defaultValue={ProjectsStatus.ACTIVE}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent className="">
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ACTIVE}
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ON_HOLD}
                        >
                          On Hold
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          Archived
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.COMPLETED}
                        >
                          Completed
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
                  <FormLabel className="flex items-center w-[25%] gap-1">
                    <Calendar className="size-5 text-neutral-400" />
                    <p>Start Date</p>
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex items-center w-full space-y-0">
                  <FormLabel className="flex items-center w-[25%] gap-1">
                    <Calendar className="size-5 text-neutral-400" />
                    <p>End Date</p>
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

            {/* <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center w-full">
                  <FormLabel className="flex w-[25%] gap-1">
                    <TagIcon className="size-5 text-neutral-400" />
                    <p>Tags</p>
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
                          value={ProjectsStatus.ARCHIVED}
                        >
                          Backlog
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          In Review
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          Todo
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          Done
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem
                          className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                          value={ProjectsStatus.ARCHIVED}
                        >
                          <p className="flex items-center">
                            <span>
                              <PlusIcon className="size-4 mr-1" />
                            </span>
                            Add New Tag
                          </p>
                        </SelectItem>
                      </SelectContent>
                    </div>
                  </Select>
                </FormItem>
              )}
            ></FormField> */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex w-full  flex-col p-3 rounded-[12px]">
                  <FormLabel>
                    <p className=" font-semibold text-sm mb-2">Description</p>
                  </FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Textarea
                        {...field}
                        placeholder="Project Description"
                        className=" px-2 py-1 w-full border rounded-md text-black min-h-[70px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          fill
                          alt="logo"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm">Project Icon</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG or JPEG, max 1mb
                      </p>
                      <input
                        className="hidden"
                        type="file"
                        accept=".jpg, .png, .jpeg, .svg"
                        ref={inputRef}
                        disabled={isPending}
                        onChange={handleImageChange}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          disabled={isPending}
                          variant="destructive"
                          size="xs"
                          className="w-fit mt-2"
                          onClick={() => {
                            field.onChange(null);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          }}
                        >
                          Remove image
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isPending}
                          variant="teritary"
                          size="xs"
                          className="w-fit mt-2"
                          onClick={() => inputRef.current?.click()}
                        >
                          Upload image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            ></FormField>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancle
            </Button>
            <Button variant="primary" disabled={isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateProject;
