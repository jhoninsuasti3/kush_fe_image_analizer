import { toast as sonnerToast } from "sonner";

// Adapter para mantener compatibilidad con el código que usa useToast
export const useToast = () => {
  return {
    toast: ({ title, description, variant }: {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (variant === "destructive") {
        sonnerToast.error(title, {
          description,
        });
      } else {
        sonnerToast.success(title, {
          description,
        });
      }
    },
  };
};