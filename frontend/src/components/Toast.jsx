import { useEffect } from "react";

const ICONS = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

const STYLES = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-gray-700",
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`${STYLES[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium pointer-events-auto animate-fade-in min-w-[220px]`}
    >
      <span>{ICONS[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}
