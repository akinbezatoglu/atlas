import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

type ResponseType = { data: Workspace };
type RequestType = { param: { workspaceId: string }; json: { code: string } };

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await api<ResponseType>(`/api/workspaces/${param.workspaceId}/join`, {
        method: "POST",
        body: json,
      });

      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Joined workspace succesfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join workspace");
    },
  });

  return mutation;
};
