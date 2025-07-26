import { ResponsiveModal } from "@/components/responsive-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { createTagsSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowUpIcon, XIcon } from "lucide-react";

export const CreateTagForm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createTagsSchema>>({
    resolver: zodResolver(createTagsSchema),
    defaultValues: {
      workspaceId,
    },
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  const tagslist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const confirmDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>Create Tag</CardTitle>
            <CardDescription>
              <Form {...form}>
                <form>
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
                </form>
              </Form>
            </CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={"primary"}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
        <div className="bg-white p-2.5 mb-1.5 rounded-[12px] shadow-sm space-y-3  mx-auto w-[400px]">
          <div className="flex items-start justify-between gap-x-2">
            <p className="text-sm line-clamp-2 font-semibold">Select Tags</p>
            <div>
              <XIcon className="size-5" />
            </div>
          </div>
          {/* <DottedSeparator /> */}
          <div className="border rounded-md h-32">
            <div className="flex-1 flex gap-2 p-1 items-center justify-items-start flex-wrap">
              {tagslist.map((l, index) => (
                <div className="p-1 px-2 bg-blue-200 text-blue-800 rounded-[12px] text-[10px]">
                  UI design
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
            />
            <Button className="flex justify-center items-center absolute h-full right-0">
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </Card>
    </ResponsiveModal>
  );
  return [confirmDialog, confirm];
};
