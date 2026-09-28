import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

type ResponseType = { data: Workspace };
type RequestType = { form: { name: string } | FormData }; // Original components pass { form } which might be FormData or an object

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      // TODO: Handle R2 image uploads. For now, we only pass name.
      const name = form instanceof FormData ? form.get("name") : form.name;
      
      const response = await api<ResponseType>("/api/workspaces", {
        method: "POST",
        body: { name },
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Workspace succesfully created");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  return mutation;
};
