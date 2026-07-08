import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(2, { message: "Username must be at least 2 characters" }),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
