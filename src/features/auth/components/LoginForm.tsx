"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "../schemas/login";
import { login } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      setAuth(res.token, res.user);

      toast.success("Successfully signed in!", {
        description: `Welcome back, ${res.user.full_name}`,
      });

      router.push("/dashboard");
    } catch {
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {/* Email Field */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          className="h-11 rounded-xl bg-card border-border placeholder:text-muted-foreground/50 focus-visible:ring-purple-600/30 focus-visible:border-purple-600/70"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-card border-border pr-11 placeholder:text-muted-foreground/50 focus-visible:ring-purple-600/30 focus-visible:border-purple-600/70"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:text-purple-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember & Forgot Row */}
      <div className="flex items-center justify-between w-full pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            className="size-4 rounded border-border bg-card text-[#7C3AED] focus:ring-[#7C3AED]/20 focus:ring-offset-background accent-[#7C3AED] transition-colors cursor-pointer"
            {...register("rememberMe")}
          />
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
        <a
          href="#forgot"
          className="text-xs font-medium text-purple-500 hover:text-purple-400 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/10 hover:shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          <>
            Sign in
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
