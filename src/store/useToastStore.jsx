import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: ({ type = "success", heading, description, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, type, heading, description, duration },
      ],
    }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const showToast = (payload) => {
  const { showToast } = useToastStore.getState();
  return showToast(payload);
};
