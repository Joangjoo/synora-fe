import React from "react";
import { AuthLogo } from "./AuthLogo";

interface AuthHeaderProps {
  subtitle?: string;
  description?: string;
}

export function AuthHeader({
  subtitle = "Welcome back.",
  description = "Sign in to continue managing your AI software projects.",
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Brand Logo */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/10 text-[#7C3AED] dark:text-[#8B5CF6] mb-4">
        <AuthLogo className="w-8 h-8" />
      </div>

      {/* Brand Title */}
      <h2 className="text-xl font-bold tracking-[0.2em] text-foreground uppercase mb-1">
        Synora
      </h2>

      {/* Subtitle */}
      <h3 className="text-base font-semibold text-foreground mb-2">
        {subtitle}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
