"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ArrowLeftIcon,
  Calendar,
  ImageIcon,
  Loader,
  Loader2Icon,
  Star,
} from "lucide-react";

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
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useConfirm } from "@/hooks/use-confirm";

import { ProjectsStatusEnum, ProjectType } from "../types";
import { useUpdateProject } from "../api/use-update-project";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { useDeleteProject } from "../api/use-delete-project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: ProjectType;
  memberOptions: {
    id: string;
    name: string | null;
  }[];
}

export const EditProjectForm = ({
  onCancel,
  initialValues,
  memberOptions,
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone",
    "destructive",
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
      status: initialValues.status,
      tags: [],
      startDate: initialValues.startDate
        ? new Date(initialValues.startDate)
        : undefined,
      endDate: initialValues.endDate
        ? new Date(initialValues.endDate)
        : undefined,
      description: initialValues.description
        ? initialValues.description
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { json: finalValues, param: { projectId: initialValues.id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteProject(
      {
        param: { projectId: initialValues.id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <div className="bg-white w-[500px] p-2.5 px-3 mb-1.5 rounded-[12px] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start text-sm pl-2">
            {/* <Star className="size-[18-px] stroke-1 shrink-0 text-blue-400 hover:opacity-75 transition mr-1" /> */}
            <p className="text-xl font-bold">Edit Project</p>
          </div>
        </div>
        <Separator className="bg-neutral-300" />

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
                        className="text-lg px-2 py-1 w-full border rounded-md"
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
                              // defaultValue={ProjectsStatusEnum.ACTIVE}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="">
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={ProjectsStatusEnum.ACTIVE}
                          >
                            Active
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={ProjectsStatusEnum.ON_HOLD}
                          >
                            On Hold
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={ProjectsStatusEnum.ARCHIVED}
                          >
                            Archived
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                            value={ProjectsStatusEnum.COMPLETED}
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full space-y-0">
                    <FormLabel className="flex items-center w-[25%] gap-1">
                      <Calendar className="size-5 text-neutral-400" />
                      <p>End Date</p>
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
                                value={ProjectsStatusEnum.ARCHIVED}
                              >
                                Backlog
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                                value={ProjectsStatusEnum.ARCHIVED}
                              >
                                In Progress
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                                value={ProjectsStatusEnum.ARCHIVED}
                              >
                                In Review
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                                value={ProjectsStatusEnum.ARCHIVED}
                              >
                                Todo
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                                value={ProjectsStatusEnum.ARCHIVED}
                              >
                                Done
                              </SelectItem>
                              <SelectSeparator />
                              <SelectItem
                                className="hover:bg-blue-100 p-1 cursor-pointer border-blue-100"
                                value={ProjectsStatusEnum.ARCHIVED}
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
                      <p className="text-sm mb-2">Description</p>
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
              <Button
                variant="primary"
                disabled={isPending}
                className="min-w-[105px]"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin h-full" /> saving
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
