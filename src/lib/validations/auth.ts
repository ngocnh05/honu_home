import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập tài khoản hoặc email"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
