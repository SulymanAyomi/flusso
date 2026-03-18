"use client";
import { PageError } from "@/components/page-error";

const ErrorPage = () => {
  return (
    <PageError
      title="Something went wrong"
      message="We ran into unexpected issue. Your data is safe."
      primaryAction={{
        label: "Go to dashboard",
        href: `/workspaces`,
      }}
    />
  );
};

export default ErrorPage;
