import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

type ResponseType = { data: Workspace };
type RequestType = { form: any; param: { workspaceId: string } };

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      // TODO: Handle R2 image uploads.
      const name = form instanceof FormData ? form.get("name") : form.name;
      
      const response = await api<ResponseType>(`/api/workspaces/${param.workspaceId}`, {
        method: "PATCH",
        body: { name },
      });

      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace succesfully updated");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workspace");
    },
  });

  return mutation;
};
