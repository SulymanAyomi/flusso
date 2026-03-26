"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Button1 = () => {
  const router = useRouter();
  return (
    <Button
      size={"lg"}
      className="text-[15px] font-medium px-7 py-5 rounded-lg"
      onClick={() => router.push("/sign-up")}
    >
      Get started free
    </Button>
  );
};

export default Button1;
