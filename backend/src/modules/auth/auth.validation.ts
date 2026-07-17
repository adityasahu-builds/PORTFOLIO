import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    usernameOrEmail: z
      .string({
        required_error: "Username or email is required",
      })
      .trim()
      .min(1, "Username or email is required"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(1, "Password is required"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];
