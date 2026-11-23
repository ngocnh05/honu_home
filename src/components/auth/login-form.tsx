"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon } from "@/components/icons/google-icon";
import { loginSchema } from "@/lib/validations/auth";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = React.useState({
    email: "ngoc",
    password: "ngoc",
    rememberMe: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMessage(null);

    // Client-side validation with Zod
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "form";
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("rememberMe", formData.rememberMe ? "true" : "false");

    startTransition(async () => {
      try {
        const res = await loginAction(null, data);
        if (res.success) {
          setServerMessage({
            type: "success",
            text: res.message || "Đăng nhập thành công!",
          });
          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          setServerMessage({
            type: "error",
            text: res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
          });
        }
      } catch (err) {
        setServerMessage({
          type: "error",
          text: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.",
        });
      }
    });
  };

  const handleGoogleSignIn = () => {
    setServerMessage({
      type: "error",
      text: "Tính năng Đăng nhập với Google đang được phát triển và sẽ sớm ra mắt!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Demo Account Badge & Quick Fill */}
      <div className="bg-white/10 border border-white/25 rounded-2xl p-4 text-xs text-white backdrop-blur-md flex items-center justify-between gap-3 shadow-inner">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Tài khoản Demo sẵn có:</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[13px] text-white/90">
            <span>
              Tài khoản: <strong className="text-white font-bold bg-white/15 px-2 py-0.5 rounded">ngoc</strong>
            </span>
            <span className="text-white/40">•</span>
            <span>
              Mật khẩu: <strong className="text-white font-bold bg-white/15 px-2 py-0.5 rounded">ngoc</strong>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormData({
              email: "ngoc",
              password: "ngoc",
              rememberMe: true,
            })
          }
          className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-xs transition-all border border-white/20 cursor-pointer whitespace-nowrap shadow-xs"
        >
          Điền sẵn
        </button>
      </div>

      {/* Alert banner if error or success */}
      {serverMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium backdrop-blur-md transition-all ${
            serverMessage.type === "success"
              ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40"
              : "bg-rose-500/20 text-rose-100 border border-rose-400/40"
          }`}
        >
          {serverMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-300" />
          )}
          <span>{serverMessage.text}</span>
        </div>
      )}

      {/* Account / Email Input Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Tài khoản / Email</Label>
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="Nhập tài khoản hoặc email (ví dụ: ngoc)"
          autoComplete="username"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          iconStart={<Mail className="w-5 h-5" />}
        />
      </div>

      {/* Password Input Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu (ví dụ: ngoc)"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          iconStart={<Lock className="w-5 h-5" />}
          iconEnd={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-white/70 hover:text-white transition-colors focus:outline-none p-1 cursor-pointer"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Remember me & Forgot Password */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            label="Ghi nhớ đăng nhập"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))
            }
          />

          <Link
            href="/forgot-password"
            className="text-white/90 hover:text-white font-medium hover:underline transition-all text-xs sm:text-sm ml-auto"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      {/* Main Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="pill"
          isLoading={isPending}
          className="w-full text-base font-semibold tracking-wide cursor-pointer"
        >
          Đăng Nhập
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-white/40 w-full" />
        <span className="bg-transparent px-4 text-sm font-medium text-white/80 select-none uppercase tracking-wider">
          Hoặc
        </span>
        <div className="border-t border-white/40 w-full" />
      </div>

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="glass"
        size="pill"
        onClick={handleGoogleSignIn}
        className="w-full gap-3 text-base font-medium cursor-pointer"
      >
        <GoogleIcon className="w-5 h-5" />
        <span>Đăng nhập bằng Google</span>
      </Button>

      {/* Sign Up Prompt Footer */}
      <p className="text-center text-sm text-white/80 pt-2">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-white font-semibold underline underline-offset-4 hover:text-white/90 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}
