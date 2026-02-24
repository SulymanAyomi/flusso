"use client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { Loader2Icon, PencilIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useVerifyOtp } from "../api/use-verify-otp";
// import { useOpenLoginModal } from "../hook/use-login";
// import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface OTPFormProps {
  vid: string;
}
export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vid = searchParams.get("vid");

  const [value, setValue] = useState("");

  const [errors, setErrors] = useState("");
  const { mutate, isPending } = useVerifyOtp();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vid) {
      setErrors("Invalid code.");
      return;
    }
    setErrors("");
    mutate(
      {
        json: {
          vid,
          otp: value,
        },
      },
      {
        onSuccess: async (data) => {
          if (data.success) {
            router.push("/sign-in");
          }
          toast.success("User verification successful");
        },
        onError: async (error) => {
          setErrors(error.message);
        },
      }
    );
  };
  return (
    <div className="bg-inherit flex flex-col items-center justify-center gap-3 p-6 pt-0 md:p-10 md:pt-0">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e)}>
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor="otp"
                    className="w-full text-center flex items-center justify-center"
                  >
                    Verification code
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={value}
                    onChange={(value) => setValue(value)}
                    className="w-full flex items-center justify-center"
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border w-full flex items-center justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {errors && (
                    <p className="text-center text-xs text-red-500">{errors}</p>
                  )}
                  <FieldDescription className="text-center">
                    Enter the 6-digit code sent to your email.
                  </FieldDescription>
                </Field>
                <FieldGroup>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <Loader2Icon className=" mr-2 animate-spin h-fit" />
                      </>
                    ) : (
                      <>Verify</>
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code? <a href="#">Resend</a>
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
