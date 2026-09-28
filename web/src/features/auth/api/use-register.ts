import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, setToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { z } from "zod";
import { registerSchema } from "../schemas";

type ResponseType = { data: User; token: string };
type RequestType = { json: z.infer<typeof registerSchema> };

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api<ResponseType>("/api/auth/register", {
        method: "POST",
        body: json,
      });

      if (response.token) {
        setToken(response.token);
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Registered succesfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register");
    },
  });

  return mutation;
};
