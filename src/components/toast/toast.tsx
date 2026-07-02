"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-[var(--spacing-xl)] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-[var(--spacing-sm)] max-sm:bottom-[var(--spacing-md)] mx-4 max-sm:max-w-[90vw] sm:max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-[var(--spacing-md)] rounded-[var(--radius-pill)] px-[var(--spacing-lg)] py-[var(--spacing-md)] backdrop-blur-[12px]",
                toast.type === "success" && "bg-green-900/80 text-green-200",
                toast.type === "error" && "bg-red-900/80 text-red-200",
                toast.type === "info" && "bg-[var(--color-surface)]/90 text-[var(--color-content)] border border-[var(--color-border-subtle)]",
              )}
            >
              {toast.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="h-4 w-4 shrink-0" />}
              {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}
              <span className="break-words font-[family-name:var(--font-body)] text-[var(--text-body)]">
                {toast.message}
              </span>
              <button
                onClick={() => remove(toast.id)}
                className="ms-[var(--spacing-sm)] shrink-0 rounded-full p-[2px] opacity-60 transition-opacity hover:opacity-100 max-sm:p-2 max-sm:[&_svg]:h-4 max-sm:[&_svg]:w-4"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
