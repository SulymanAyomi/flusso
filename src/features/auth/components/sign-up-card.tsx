"use client";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "../schema";
import { useRegister } from "../api/use-register";
import { FieldLabel } from "@/components/ui/field";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export const SignUpCard = () => {
  const [error, setError] = useState("");
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate(
      { json: values },
      {
        onError: async (error) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="">
        <CardHeader className="flex items-center justify-center text-center pb-2">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-xs">
            <p>
              Already have an account?
              <Link href="/sign-in">
                <span className="text-blue-700">&nbsp; Sign In</span>
              </Link>
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="John Doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
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
                    </div>
                    <FormControl>
                      <Input {...field} type="password" id="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button disabled={isPending} size="lg" className="w-full">
                {isPending && (
                  <>
                    <Loader2Icon className="mr-2 animate-spin h-full" />
                  </>
                )}
                Sign up
              </Button>
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardContent className="flex flex-col pb-5">
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
      </Card>
    </div>
  );
};
