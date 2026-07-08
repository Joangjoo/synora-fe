import React from "react";
import { RegisterCard } from "@/features/auth/components/RegisterCard";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Create Account - SYNORA",
  description: "Sign up to start managing your AI software projects.",
};

export default function RegisterPage() {
  return (
    <div className="dark min-h-screen w-full bg-[#09090B] text-foreground flex flex-col items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.04),transparent_50%)] pointer-events-none z-0" />
      <RegisterCard />
      <footer className="mt-8 text-[10px] font-medium tracking-[0.3em] text-muted-foreground/60 uppercase select-none z-10 text-center">
        © 2026 Synora AI
      </footer>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
