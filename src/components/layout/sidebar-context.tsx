"use client";

import * as React from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Load saved preference from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("honuhome_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch (_e) {
      // Ignore if localStorage unavailable
    }
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("honuhome_sidebar_collapsed", String(next));
      } catch (_e) {}
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, setIsCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
