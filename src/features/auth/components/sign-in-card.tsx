"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { loginSchema } from "../schema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

export const SignInCard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    console.log(res);
    if (res?.ok) {
      router.push("/workspaces");
      queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };
  if (error) {
    console.log(error);
  }
  return (
    <Card className="">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Please enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="m@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <FormControl>
                    <Input {...field} type="password" id="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button disabled={loading} size="lg" className="w-full">
              {loading && (
                <>
                  <Loader2Icon className="mr-1 animate-spin h-full" />
                </>
              )}{" "}
              Login
            </Button>
          </form>
        </Form>
        {error && (
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        )}
      </CardContent>
      <CardContent className="flex flex-col gap-y-4">
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
      </CardContent>
      <CardContent className="flex items-center justify-center">
        <p className="text-sm">
          Don&apos;t have an account?
          <Link href="/sign-up">
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
