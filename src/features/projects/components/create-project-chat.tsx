// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from "./create-project-chat.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUp, SparklesIcon, StopCircleIcon } from "lucide-react";
import { Chat, ProjectType } from "../types";
import Markdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { createAIProjectSchema, createProjectPromptSchema } from "../schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Fragment } from "react";

interface CreateProjectChatProps {
  chats: Chat;
  isPending: boolean;
  setDisplay: (display: "prompt" | "chat" | "preview") => void;
  onSubmitPrompt({
    prompt,
    type,
  }: {
    prompt: string;
    type: "AI" | "user";
  }): Promise<void>;
  backendStatus: "idle" | "understanding" | "initializing" | "generated";
}

export const CreateProjectChat = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chats,
  isPending,
  setDisplay,
  onSubmitPrompt,
  backendStatus,
}: CreateProjectChatProps) => {
  const form = useForm<z.infer<typeof createProjectPromptSchema>>({
    resolver: zodResolver(createProjectPromptSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const onSubmit = async (
    values: z.infer<typeof createProjectPromptSchema>
  ) => {
    console.log(values);
    setDisplay("chat");
    onSubmitPrompt({ prompt: values.prompt, type: "user" });
    form.reset();
  };
  return (
    <div className="h-full  flex flex-col items-center px-3 pt-3">
      <div className="flex-1 w-full flex justify-center relative">
        <div className=" w-full lg:w-3/6 flex flex-col gap-5">
          {chats.map((chat, index) =>
            chat.type === "user" ? (
              <div
                className={cn(
                  "p-3 bg-neutral-100 rounded-xl w-fit self-end rounded-tr-none"
                )}
                key={index}
              >
                {chat.prompt}
              </div>
            ) : (
              <Fragment key={index}>
                <AIChats chat={chat} />
              </Fragment>
            )
          )}

          {backendStatus !== "idle" && <LoaderBubble status={backendStatus} />}
          <div className="w-full px-4 flex rounded-md  bottom-2 mb-2">
            <Form {...form}>
              <form
                className="flex flex-1"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex items-center px-2  w-full bg-neutral-100 rounded-md">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="What can I help you with?"
                            className="border-none focus:border-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-neutral-100  break-words whitespace-pre-wrap overflow-hidden resize-none"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  ></FormField>
                  <Button
                    disabled={isPending}
                    className="flex justify-center items-center rounded-full  size-10 p-0"
                  >
                    {isPending ? <StopCircleIcon /> : <ArrowUp />}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AIChatsProps {
  chat: {
    prompt: string;
    type: string;
  };
}
const AIChats = ({ chat }: AIChatsProps) => {
  if (chat.prompt === "validating prompt") {
    return (
      <div className="p-3 bg-neutral-100 rounded-xl max-w-full w-fit self-start flex items-center rounded-tl-none">
        <SparklesIcon className="size-4 mr-2" />{" "}
        <p>Understanding your request...</p>
      </div>
    );
  }
  return (
    <div className="p-3 bg-neutral-100 rounded-xl max-w-full w-fit self-start flex items-center rounded-tl-none">
      <Markdown>{chat.prompt}</Markdown>
    </div>
  );
};

function LoaderBubble({
  status,
}: {
  status: "understanding" | "initializing" | "generated";
}) {
  const textMap = {
    understanding: "Understanding your request...",
    initializing: "Initializing the project...",
    generated: "Project generated.",
  };
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-100 rounded-xl max-w-full w-fit self-start rounded-tl-none">
      {/* Icon with orbiting ring */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Sparkle in center */}
        <span className="text-xl">✨</span>

        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
      </div>

      {/* Status text */}
      <span className="text-gray-600">{textMap[status]}</span>
    </div>
  );
}
