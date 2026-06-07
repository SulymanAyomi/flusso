"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useRequestEmailChangeOtp } from "../../api/use-request-email-change";

interface LoginFormProps {
  className?: string;
  updateEmail: (email: string, vid: string) => void;
  nextStep: () => void;
}
export function RequestEmailChangeForm({
  className,
  updateEmail,
  nextStep,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const { mutate, isPending } = useRequestEmailChangeOtp();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors("");
    mutate(
      {
        json: {
          email,
        },
      },
      {
        onSuccess(data) {
          if (data.success) {
            updateEmail(email, data.data.vid);
            nextStep();
          }
        },
        onError(data) {
          setErrors(data.message);
        },
      },
    );
  };

  return (
    <div className="bg-inherit flex flex-col items-center justify-center gap-3 p-6 pt-0 md:pt-0 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Request email change</CardTitle>
            <CardDescription>
              <p>Enter your new email address below and check for the otp</p>
            </CardDescription>
            {errors && (
              <div className="p-3 bg-red-100 text-red-500 mb-1">
                <p className="text-xs">{errors}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2Icon className=" mr-2 animate-spin" />
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
