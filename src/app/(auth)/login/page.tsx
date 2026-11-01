import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-[640px] bg-[#294255]/70 backdrop-blur-xl border-2 border-white/90 rounded-[26px] shadow-2xl p-12 space-y-8 animate-fadeIn mx-auto">
      {/* Header with Logo & Welcome Title */}
      <AuthHeader
        title="Chào mừng trở lại!"
        subtitle="Đăng nhập để quản lý dự án, hệ thống phòng và khách thuê HonuHome"
      />

      {/* Main Login Form */}
      <LoginForm />
    </div>
  );
}
