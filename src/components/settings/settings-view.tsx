"use client";

import * as React from "react";
import {
  Settings,
  Building2,
  CreditCard,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  QrCode,
  Calendar,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useSnackbar } from "@/components/common/snackbar";

export function SettingsView() {
  const { success } = useSnackbar();

  // General Settings
  const [brandName, setBrandName] = React.useState("HonuHome - Hệ Thống Căn Hộ Dịch Vụ");
  const [hotline, setHotline] = React.useState("0918.137.153");
  const [email, setEmail] = React.useState("contact@honuhome.vn");

  // Banking for VietQR
  const [bankName, setBankName] = React.useState("Techcombank");
  const [accountNumber, setAccountNumber] = React.useState("1903688888");
  const [accountOwner, setAccountOwner] = React.useState("NGUYEN VAN QUY BINH");
  const [transferPrefix, setTransferPrefix] = React.useState("HONU");

  // Billing cycle
  const [meterClosingDay, setMeterClosingDay] = React.useState("25");
  const [paymentDueDay, setPaymentDueDay] = React.useState("28");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success("Đã lưu toàn bộ cấu hình hệ thống thành công!");
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#253F5B] flex items-center justify-center border border-slate-200 shadow-inner">
            <Settings className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Cài Đặt Hệ Thống HonuHome
              </h1>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Tài khoản ngân hàng VietQR nhận tiền, chu kỳ chốt số điện nước và thông tin thương hiệu
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Tài khoản ngân hàng VietQR */}
        <div className="bg-white p-6 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5FA]">
            <CreditCard className="w-5 h-5 text-[#5C84BE]" />
            <div>
              <h3 className="text-base font-black text-[#253F5B]">
                Tài Khoản Ngân Hàng Nhận Tiền (VietQR)
              </h3>
              <p className="text-xs text-[#7A93AD]">
                Thông tin này sẽ tự động tạo mã QR trên phiếu thu gửi cho khách thuê
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Ngân hàng thụ hưởng *</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white font-bold text-[#253F5B] outline-none"
              >
                <option value="Techcombank">Techcombank (TCB)</option>
                <option value="Vietcombank">Vietcombank (VCB)</option>
                <option value="MBBank">MBBank (Quân Đội)</option>
                <option value="ACB">ACB (Á Châu)</option>
                <option value="VPBank">VPBank</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Số tài khoản nhận tiền *</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] font-mono font-bold text-[#253F5B] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Tên chủ tài khoản (Không dấu) *</label>
              <input
                type="text"
                required
                value={accountOwner}
                onChange={(e) => setAccountOwner(e.target.value.toUpperCase())}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] font-bold text-[#253F5B] uppercase outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Cú pháp nội dung chuyển khoản</label>
              <input
                type="text"
                value={transferPrefix}
                onChange={(e) => setTransferPrefix(e.target.value)}
                placeholder="HONU [Số phòng] [Tháng]"
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] font-bold text-[#5C84BE] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Chu kỳ chốt hóa đơn */}
        <div className="bg-white p-6 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5FA]">
            <Calendar className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-black text-[#253F5B]">
                Chu Kỳ Chốt Số & Thu Tiền Hàng Tháng
              </h3>
              <p className="text-xs text-[#7A93AD]">
                Quy định mốc thời gian tự động chốt số điện nước và hạn nộp tiền phòng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Ngày chốt số điện nước hàng tháng</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={meterClosingDay}
                  onChange={(e) => setMeterClosingDay(e.target.value)}
                  className="w-24 h-10 px-3 rounded-xl border border-[#D9E6F2] font-bold text-center text-[#253F5B]"
                />
                <span className="text-[#526579] font-medium">hàng tháng (Ví dụ: ngày 25)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Hạn thanh toán hóa đơn</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={paymentDueDay}
                  onChange={(e) => setPaymentDueDay(e.target.value)}
                  className="w-24 h-10 px-3 rounded-xl border border-[#D9E6F2] font-bold text-center text-rose-600"
                />
                <span className="text-[#526579] font-medium">hàng tháng (Ví dụ: ngày 28)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Thông tin thương hiệu */}
        <div className="bg-white p-6 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5FA]">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-black text-[#253F5B]">
                Thông Tin Thương Hiệu & Liên Hệ
              </h3>
              <p className="text-xs text-[#7A93AD]">Hiển thị trên đầu phiếu thu và văn bản hợp đồng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Tên hệ thống</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] font-bold text-[#253F5B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-[#253F5B]">Hotline hỗ trợ khách thuê</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] font-bold text-[#253F5B]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
