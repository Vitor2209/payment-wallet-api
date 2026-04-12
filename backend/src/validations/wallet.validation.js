import { z } from "zod";

// ============================
// DEPOSIT VALIDATION
// ============================
export const depositSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Amount must be a number"
    })
    .positive("Amount must be greater than 0")
    .max(1000000, "Maximum deposit limit is 1,000,000")
});

// ============================
// TRANSFER VALIDATION
// ============================
export const transferSchema = z.object({
  toEmail: z
    .string()
    .email("Invalid email format"),

  amount: z
    .number({
      invalid_type_error: "Amount must be a number"
    })
    .positive("Amount must be greater than 0")
});