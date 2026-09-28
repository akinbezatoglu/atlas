import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error>({
    mutationFn: async () => {
      // Backend statelesstır (JWT kullanıyoruz), sadece client'tan token'ı siliyoruz.
      clearToken();
      return;
    },
    onSuccess: () => {
      toast.success("Logged out succesfully");
      router.refresh();
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log out");
    },
  });

  return mutation;
};
