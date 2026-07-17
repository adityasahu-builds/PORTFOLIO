import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: "Full name is required",
      })
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters")
      .trim(),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format")
      .trim()
      .toLowerCase(),
    subject: z
      .string({
        required_error: "Subject is required",
      })
      .min(1, "Subject is required")
      .max(150, "Subject cannot exceed 150 characters")
      .trim(),
    message: z
      .string({
        required_error: "Message is required",
      })
      .min(10, "Message must be at least 10 characters")
      .max(5000, "Message cannot exceed 5000 characters")
      .trim(),
  }),
});

export type CreateContactInput = z.infer<typeof createContactSchema>["body"];
