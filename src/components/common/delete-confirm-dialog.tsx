"use client";

import * as React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  itemName,
  description,
  confirmText = "Xóa vĩnh viễn",
  cancelText = "Hủy bỏ",
  isLoading = false,
}: DeleteConfirmDialogProps) {
  // Support closing with Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-150 cursor-default relative overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Đóng hộp thoại"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center ring-8 ring-rose-50/60 mb-4 shadow-sm">
          <Trash2 className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-[#253F5B] tracking-tight">
          {title}
        </h3>

        {/* Item highlighted name */}
        {itemName && (
          <div className="mt-1 px-3 py-1 rounded-xl bg-slate-100 text-[#253F5B] text-xs font-bold border border-slate-200 max-w-full truncate">
            {itemName}
          </div>
        )}

        {/* Warning text */}
        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3">
          {description ||
            "Hành động này không thể hoàn tác. Dữ liệu này sẽ bị xóa hoàn toàn khỏi hệ thống."}
        </p>

        {/* Danger alert pill */}
        <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Lưu ý: Dữ liệu đã xóa sẽ không thể khôi phục lại</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4 stroke-[2.2]" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
