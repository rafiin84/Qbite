import { z } from "zod";

export const consumerLoginSchema = z.object({
  email: z.string().min(1, "Enter your college email").email("Enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type ConsumerLoginValues = z.infer<typeof consumerLoginSchema>;

export const staffLoginSchema = z.object({
  email: z.string().min(1, "Enter your staff email").email("Enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type StaffLoginValues = z.infer<typeof staffLoginSchema>;

export const consumerSignUpSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().min(1, "Enter your college email").email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type ConsumerSignUpValues = z.infer<typeof consumerSignUpSchema>;
