import React, { useRef, useState } from "react";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { WorkspaceType } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { uploadFile } from "@/lib/upload";
import { FieldError } from "@/components/ui/field";
interface SettingsWorkspaceProp {
  workspace: WorkspaceType;
  isOwner: boolean;
}
const SettingsWorkspace = ({ workspace, isOwner }: SettingsWorkspaceProp) => {
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      ...workspace,
      image: workspace.imageUrl ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
    try {
      setIsLoadingImg(true);
      const image = values.image instanceof File ? values.image : "";
      console.log(image);

      const finalValues: {
        name: string;
        imageUrl: string | null;
        imageUrlPublicId: string | null;
      } = {
        name: values.name!,
        imageUrl: workspace.imageUrl,
        imageUrlPublicId: workspace.imageUrlPublicId,
      };
      if (image) {
        const { url, publicId } = await uploadFile(image, "avatar");
        finalValues.imageUrl = url;
        finalValues.imageUrlPublicId = publicId;
        setIsLoadingImg(false);
      }
      console.log("fffffffff");
      mutate(
        { json: finalValues, param: { workspaceId: workspace?.id! } },
        {
          onSuccess: () => {},
        },
      );
    } catch (error) {
    } finally {
      setIsLoadingImg(false);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const isLoading = isPending || isLoadingImg;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.push(`/workspaces/${workspace.id}`)}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardDescription>
          <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-3">
        <Separator />
      </div>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter workspace name"
                        disabled={!isOwner}
                      />
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
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1mb
                        </p>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          disabled={isLoading}
                          onChange={handleImageChange}
                        />
                        <div className="flex gap-3">
                          {isOwner && (
                            <Button
                              type="button"
                              disabled={isLoading}
                              variant="teritary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload image
                            </Button>
                          )}

                          {field.value && (
                            <>
                              {isOwner && (
                                <Button
                                  type="button"
                                  disabled={isLoading}
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
                              )}
                            </>
                          )}
                        </div>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                )}
              ></FormField>
            </div>
            {isOwner && (
              <>
                <Separator className="my-7" />
                <div className="flex items-center justify-end">
                  <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-1 h-full animate-spin " />
                        Saving
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsWorkspace;
