import React from "react";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Sign In - SYNORA",
  description: "Sign in to continue managing your AI software projects.",
};

export default function LoginPage() {
  return (
    <div className="dark min-h-screen w-full bg-[#09090B] text-foreground flex flex-col items-center justify-center relative overflow-hidden py-12">
      {/* Premium Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
      
      {/* Subtle radial glow to highlight the center card */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.04),transparent_50%)] pointer-events-none z-0" />

      {/* Main Authentication Card */}
      <AuthCard />

      {/* Page Footer */}
      <footer className="mt-8 text-[10px] font-medium tracking-[0.3em] text-muted-foreground/60 uppercase select-none z-10 text-center">
        © 2024 Synora AI • Precision-Premium
      </footer>

      {/* Toast Notification Container */}
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
