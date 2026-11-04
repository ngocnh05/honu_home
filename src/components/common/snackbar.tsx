"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type SnackbarType = "success" | "warning" | "error";

export interface SnackbarItem {
  id: string;
  type: SnackbarType;
  title: string;
  message?: string;
  duration?: number; // ms, default 3500ms
}

interface SnackbarContextType {
  showSnackbar: (item: Omit<SnackbarItem, "id">) => void;
  success: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  removeSnackbar: (id: string) => void;
}

const SnackbarContext = React.createContext<SnackbarContextType | null>(null);

export function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = React.useState<SnackbarItem[]>([]);

  const removeSnackbar = React.useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showSnackbar = React.useCallback(
    (item: Omit<SnackbarItem, "id">) => {
      const id = `sb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newSnackbar: SnackbarItem = {
        ...item,
        id,
        duration: item.duration ?? 3800,
      };

      setSnackbars((prev) => [newSnackbar, ...prev].slice(0, 5)); // Keep max 5 stacked
    },
    []
  );

  const success = React.useCallback(
    (title: string, message?: string, duration?: number) => {
      showSnackbar({ type: "success", title, message, duration });
    },
    [showSnackbar]
  );

  const warning = React.useCallback(
    (title: string, message?: string, duration?: number) => {
      showSnackbar({ type: "warning", title, message, duration });
    },
    [showSnackbar]
  );

  const error = React.useCallback(
    (title: string, message?: string, duration?: number) => {
      showSnackbar({ type: "error", title, message, duration });
    },
    [showSnackbar]
  );

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar, success, warning, error, removeSnackbar }}
    >
      {children}

      {/* Top Right Floating Container */}
      <div
        aria-live="assertive"
        className="fixed top-4 right-4 z-[9999] flex flex-col items-end gap-2 max-w-lg w-full pointer-events-none select-none transition-all duration-300"
      >
        {snackbars.map((item) => (
          <SnackbarCard
            key={item.id}
            item={item}
            onClose={() => removeSnackbar(item.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

// Individual Toast / Snackbar Card Component
function SnackbarCard({
  item,
  onClose,
}: {
  item: SnackbarItem;
  onClose: () => void;
}) {
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(100);

  const duration = item.duration || 3800;

  React.useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, isPaused, onClose]);

  // Configurations for 3 colors: Xanh (Success), Vàng (Warning), Đỏ (Error)
  const config = React.useMemo(() => {
    switch (item.type) {
      case "success":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-50/95 border-emerald-200/90 text-emerald-950",
          iconBg: "bg-emerald-500 text-white shadow-emerald-500/25",
          titleColor: "text-emerald-900",
          msgColor: "text-emerald-700",
          progressBar: "bg-emerald-500",
          badgeLabel: "Thành công",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bg: "bg-amber-50/95 border-amber-200/90 text-amber-950",
          iconBg: "bg-amber-500 text-white shadow-amber-500/25",
          titleColor: "text-amber-900",
          msgColor: "text-amber-800",
          progressBar: "bg-amber-500",
          badgeLabel: "Cảnh báo",
        };
      case "error":
        return {
          icon: AlertCircle,
          bg: "bg-rose-50/95 border-rose-200/90 text-rose-950",
          iconBg: "bg-rose-500 text-white shadow-rose-500/25",
          titleColor: "text-rose-900",
          msgColor: "text-rose-700",
          progressBar: "bg-rose-500",
          badgeLabel: "Thông báo lỗi",
        };
    }
  }, [item.type]);

  const Icon = config.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border shadow-md backdrop-blur-md transition-all duration-200 animate-in slide-in-from-top-2 fade-in overflow-hidden max-w-sm ${config.bg}`}
    >
      {/* Small Icon Badge */}
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 shadow-2xs ${config.iconBg}`}
      >
        <Icon className="w-3 h-3 stroke-[2.6]" />
      </div>

      {/* 1 Dòng Duy Nhất: Siêu gọn gàng */}
      <span className={`text-xs font-bold whitespace-nowrap ${config.titleColor}`}>
        {item.title}
        {item.message ? ` — ${item.message}` : ""}
      </span>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="p-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer shrink-0 ml-1"
        aria-label="Đóng thông báo"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Slim Countdown Progress Bar (2px) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
