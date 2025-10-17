import { toast } from "react-hot-toast";

export const toastService = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#EF4444",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "⚠️",
      style: {
        background: "#F59E0B",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "ℹ️",
      style: {
        background: "#3B82F6",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "#6B7280",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
}; 