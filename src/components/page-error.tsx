"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageErrorProps {
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}
export const PageError = ({
  message = "Something went wrong",
  title,
  primaryAction,
  secondaryAction,
}: PageErrorProps) => {
  const router = useRouter();
  return (
    <div className="h-[calc(100vh-88px)] w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
          <h2 className="text-3xl font-semibold tracking-tight first-letter:capitalize">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>

        <div className="flex items-center gap-2 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          {primaryAction && (
            <Button
              className="gap-2 bg-gradient-to-r from-brand1 to-brand2 hover:opacity-90 transition-opacity"
              onClick={() => router.push(primaryAction.href)}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
