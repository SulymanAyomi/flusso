import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flusso",
  description:
    "Flusso is a high-performance, AI-assisted productivity and project management web application for individuals and teams. Flusso brings tasks, projects, team collaboration, and AI-powered insights into one calm, intelligent workspace.",
  keywords: [
    "AI-assisted productivity",
    "project management",
    "task management",
  ],
  icons: {
    icon: "http://localhost:4000/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
