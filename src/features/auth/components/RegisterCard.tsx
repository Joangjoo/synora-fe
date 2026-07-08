import React from "react";
import { AuthHeader } from "./AuthHeader";
import { RegisterForm } from "./RegisterForm";
import { SocialLogin } from "./SocialLogin";
import { LoginLink } from "./LoginLink";

export function RegisterCard() {
  return (
    <div className="w-full max-w-[420px] bg-[#18181B] border border-[#27272A] rounded-2xl px-8 py-10 shadow-2xl flex flex-col gap-6 relative z-10 mx-4">
      <AuthHeader
        subtitle="Create account."
        description="Sign up to start managing your AI software projects."
      />
      <RegisterForm />
      <SocialLogin />
      <LoginLink />
    </div>
  );
}
