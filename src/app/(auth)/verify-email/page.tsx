"use client";
import { PageLoader } from "@/components/page-loader";
import { useGetOTP } from "@/features/auth/api/use-get-otp";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    router.push("/sign-in");
  }

  const { data, isPending } = useGetOTP({
    email: email!,
  });

  if (isPending) {
    return <PageLoader />;
  }
  if (data) {
    router.push(`/verification?vid=${data.vid}&email=${email}`);
  }
  return (
    <div className="bg-inherit flex flex-col items-center justify-center gap-3 p-6 pt-0 md:p-10 md:pt-0">
      <div className="w-full h-full text-center">
        <p>Sending verification code...</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
