"use client";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaGoogleDrive } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import MobileBackButton from "@/components/mobile-back-button";

const SecurityClient = () => {
  const updatePassword = z.object({
    newPassword: z.string().min(8, "Minimum of 8 characters"),
    newPassword2: z.string().min(8, "Minimum of 8 characters"),
  });
  const form = useForm<z.infer<typeof updatePassword>>({
    resolver: zodResolver(updatePassword),
  });

  const onSubmit = (values: z.infer<typeof updatePassword>) => {
    const finalValues = {
      ...values,
    };
    // mutate(
    //   { form: finalValues, param: { workspaceId: workspace?.id! } },
    //   {
    //     onSuccess: () => {
    //       form.reset();
    //     },
    //   },
    // );
  };
  return (
    <div className="flex flex-col">
      <PageHeader
        header={"Account Settings"}
        subText="Manage your personal information, security, and workspace memberships."
        button={false}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">Security</h2>
      </div>
      <div className="p-3 w-full bg-neutral-100">
        <MobileBackButton />
        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto">
          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Change Password
                </CardTitle>
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
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="*********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name="newPassword2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <>
                    <div className="flex items-center justify-end mt-3">
                      <Button type="submit" size="lg">
                        Save Changes
                      </Button>
                    </div>
                  </>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Connected accounts
                </CardTitle>
                <p className="text-xs">
                  Link external providers to sign in faster.
                </p>
              </CardDescription>
            </CardHeader>
            <div className="px-7 mb-3">
              <Separator />
            </div>
            <CardContent>
              <div className="flex items-center px-5 py-4 gap-4">
                <span className="text-xs text-secondary-foreground w-32 flex-shrink-0">
                  Google
                </span>
                <div className="flex items-center gap-2">
                  <FcGoogle className="mr-2 size-5" />
                  <span
                    className="flex items-center gap-1.5 bg-primary-foreground rounded-sm py-1 px-2.5
                    text-xs font-medium"
                  >
                    Connected as jordan@gmail.com
                  </span>
                </div>
                <Button
                  variant={"outline"}
                  style={{
                    color: "#a32d2d",
                    borderColor: "#f09595",
                    fontSize: 12,
                  }}
                >
                  Unlink
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityClient;

function FieldRow({
  label,
  value,
  action,
  onAction,
  actionColor,
}: {
  label: string;
  value: React.ReactNode;
  action?: string;
  onAction?: () => void;
  actionColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        gap: 16,
        borderTop: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary, #666)",
          width: 120,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: "var(--color-text-primary, #111)",
        }}
      >
        {value}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            fontSize: 12,
            color: actionColor ?? "#185FA5",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
