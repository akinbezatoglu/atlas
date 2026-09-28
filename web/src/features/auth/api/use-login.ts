import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, setToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { z } from "zod";
import { loginSchema } from "../schemas";

type ResponseType = { data: User; token: string };
type RequestType = { json: z.infer<typeof loginSchema> };

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api<ResponseType>("/api/auth/login", {
        method: "POST",
        body: json,
      });

      if (response.token) {
        setToken(response.token);
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Logged in succesfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log in");
    },
  });

  return mutation;
};
