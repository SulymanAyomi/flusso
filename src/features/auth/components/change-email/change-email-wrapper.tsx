"use client";
import React, { useState } from "react";
import { RequestEmailChangeForm } from "./request-email-change-form";
import { OTPForm } from "./otp-form";

interface ChangeEmailWrapperProps {
  onCancle: () => void;
}
const ChangeEmailWrapper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [vid, setVid] = useState("");

  const nextStep = () => {
    setCurrentStep(1);
  };
  const prevStep = () => {
    setCurrentStep(0);
  };
  const updateEmail = (email: string, vid: string) => {
    setEmail(email);
    setVid(vid);
  };
  return (
    <>
      {currentStep == 0 && (
        <RequestEmailChangeForm updateEmail={updateEmail} nextStep={nextStep} />
      )}
      {currentStep == 1 && (
        <OTPForm prevStep={prevStep} email={email} vid={vid} />
      )}
    </>
  );
};

export default ChangeEmailWrapper;
