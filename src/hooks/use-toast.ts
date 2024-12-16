import { Toast, ToastActionElement } from "../components/ui/toast"

export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (toast) => {
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
}
