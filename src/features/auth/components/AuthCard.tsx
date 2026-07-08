import React from "react";
import { AuthHeader } from "./AuthHeader";
import { LoginForm } from "./LoginForm";
import { SocialLogin } from "./SocialLogin";
import { RegisterLink } from "./RegisterLink";

export function AuthCard() {
  return (
    <div className="w-full max-w-[420px] bg-[#18181B] border border-[#27272A] rounded-2xl px-8 py-10 shadow-2xl flex flex-col gap-6 relative z-10 mx-4">
      {/* Brand & Heading Section */}
      <AuthHeader />

      {/* Login Credentials Form */}
      <LoginForm />

      {/* Google Sign In Option */}
      <SocialLogin />

      {/* Switch to Register Screen */}
      <RegisterLink />
    </div>
  );
}
