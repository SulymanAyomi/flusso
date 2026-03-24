"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { DottedSeparator } from "@/components/dotted-separator";
import { useResetPassword } from "../api/use-reset-password";
import { resetSchema } from "../schema";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const { mutate, isPending } = useResetPassword();

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: token ?? "",
      newPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetSchema>) => {
    setShow(false);
    mutate(
      { json: values },
      {
        onSuccess: (data) => {
          setSuccess(true);
          form.reset();
        },
        onError: () => {
          setSuccess(false);
        },
        onSettled: () => {
          setShow(true);
        },
      },
    );
  };
  return (
    <Card className="w-fit h-fit md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardDescription>
          <CardTitle className="text-xl">Password Reset</CardTitle>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button disabled={isPending} size="lg" className="w-full">
              {isPending ? (
                <Loader2Icon className="text-white animate-spin size-4" />
              ) : (
                "Reset password"
              )}
            </Button>
            {show && (
              <div className="text-sm">
                {success ? (
                  <p>Your password has been reset</p>
                ) : (
                  <p>Password reset failed</p>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
