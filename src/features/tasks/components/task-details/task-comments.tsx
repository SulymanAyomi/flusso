import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { FileIcon, ImageIcon, SmileIcon } from "lucide-react";
import React, { useState } from "react";
import { useGetTaskComments } from "../../api/use-get-task-comments";
import { useForm } from "react-hook-form";
import { createCommentsSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreateComments } from "../../api/use-create-comments";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskCommentsProps {
  taskId: string;
}
const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const { data: comments, isLoading } = useGetTaskComments({ taskId });
  const form = useForm<z.infer<typeof createCommentsSchema>>({
    resolver: zodResolver(createCommentsSchema),
  });
  const { mutate, isPending } = useCreateComments();

  const onSubmit = (values: z.infer<typeof createCommentsSchema>) => {
    mutate(
      {
        json: {
          ...values,
        },
        param: {
          taskId,
        },
      },
      {
        onSuccess: () => {
          form.setValue("content", "");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2 w-full p-4">
        {[...Array(5)].map(() => (
          <div className="flex justify-start items-center gap-2 w-full">
            <div className="flex items-center justify-center">
              <Skeleton className="size-8 rounded-full" />
            </div>
            <div className="flex justify-start items-center w-full">
              <Skeleton className="w-full h-8 mr-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-5 flex-col p-4 text-black">
      <div className="flex flex-col gap-4">
        {comments && comments?.length > 0
          ? comments.map((comment) => (
              <TaskCommentList key={comment.id} comment={comment} />
            ))
          : null}
      </div>
      <div className="flex flex-col relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="w-full">
                      <Textarea
                        {...field}
                        placeholder="Add Comments"
                        className="text-[10px] min-h-[100px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="absolute" />
                  <div className="absolute bottom-0 p-2 right-0 left-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <Button
                          disabled={isPending}
                          className="text-xs w-fit h-fit px-3 py-2 bg-blue-700 text-white bottom-0"
                        >
                          {isPending ? "Saving..." : "Comment"}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileIcon className="size-4" />
                        <SmileIcon className="size-4" />
                        <ImageIcon className="size-4" />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>
      </div>
    </div>
  );
};
interface TaskCommentListProps {
  comment: {
    id: string;
    content: string;
    user: {
      user: {
        name: string | null;
      };
    } | null;
    createdAt: string;
  };
}
const TaskCommentList = ({ comment }: TaskCommentListProps) => {
  return (
    <div>
      {/* comment lists */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-start items-start gap-2">
          <div className="flex items-center justify-center">
            <MemberAvatar className="size-8" name={comment.user?.user.name!} />
          </div>
          <div className="flex flex-col gap-1 justify-start">
            <p className="text-black font-semibold">
              {comment.user?.user.name}
              <span className="text-[10px] text-neutral-700 ml-1">
                1 day ago
              </span>
            </p>
            <p className="text-xs">{comment.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
