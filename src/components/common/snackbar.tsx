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
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none transition-all duration-300"
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
      className={`pointer-events-auto relative w-full rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 fade-in duration-200 overflow-hidden ${config.bg}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon Circle */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${config.iconBg}`}
        >
          <Icon className="w-5 h-5 stroke-[2.4]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-extrabold tracking-tight leading-snug ${config.titleColor}`}>
              {item.title}
            </h4>
          </div>

          {item.message && (
            <p className={`text-xs font-medium mt-1 leading-relaxed ${config.msgColor}`}>
              {item.message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
