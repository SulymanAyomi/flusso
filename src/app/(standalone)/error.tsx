"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter()
  return (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center px-6">
      <AlertTriangle className="size-6" />
      <p className="text-sm font-semibold">Something went wrong</p>
       <div className="flex items-center gap-2 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button asChild className="bg-gradient-to-r from-brand1 to-brand2 hover:opacity-90 transition-opacity">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
    </div>
  );
};

export default ErrorPage;
