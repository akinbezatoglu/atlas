import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type ResponseType = { data: { id: string } };
type RequestType = { param: { workspaceId: string } };

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api<ResponseType>(`/api/workspaces/${param.workspaceId}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace succesfully deleted");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete workspace");
    },
  });

  return mutation;
};
