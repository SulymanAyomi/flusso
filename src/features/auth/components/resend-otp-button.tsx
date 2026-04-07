"use client";

import { useEffect } from "react";
import { useCountdown } from "../hook/use-countdown";
import { useResendOtp } from "../api/use-resend-otp";

interface ResendOtpButtonProps {
  email: string;
  onResend?: () => void;
  changeVerId: (id: string) => void;
}

export function ResendOtpButton({
  email,
  onResend,
  changeVerId,
}: ResendOtpButtonProps) {
  const { timeLeft, start, isRunning } = useCountdown(60);
  // Start countdown immediately on mount (first OTP was just sent)
  useEffect(() => {
    start();
  }, []);

  const { mutate, isPending } = useResendOtp();

  const handleResend = async () => {
    mutate(
      { json: { email } },
      {
        onSuccess: (data) => {
          changeVerId(data.data.vid);
          start(); // restart countdown
          onResend?.();
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-muted-foreground">Didn't receive a code?</span>
      {isRunning ? (
        <span className="text-muted-foreground">
          Resend in{" "}
          <span className="font-medium text-foreground">{timeLeft}s</span>
        </span>
      ) : (
        <button
          onClick={handleResend}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Resend
        </button>
      )}
    </div>
  );
}
