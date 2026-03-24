"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { resetRequestSchema } from "../schema";
import { useResetRequest } from "../api/use-reset-request";
import { Loader2Icon } from "lucide-react";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { mutate, isPending } = useResetRequest();

  const form = useForm<z.infer<typeof resetRequestSchema>>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetRequestSchema>) => {
    setSent(false);
    mutate(
      { json: values },
      {
        onSettled: () => {
          setSent(true);
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
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
            <CardContent>
              {sent && (
                <p className="text-sm">Reset link sent if email exists.</p>
              )}
            </CardContent>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
