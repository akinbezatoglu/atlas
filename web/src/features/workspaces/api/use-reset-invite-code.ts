import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

type ResponseType = { data: Workspace };
type RequestType = { param: { workspaceId: string } };

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api<ResponseType>(`/api/workspaces/${param.workspaceId}/reset-invite-code`, {
        method: "POST",
      });

      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace invite code reset succesfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset invite code");
    },
  });

  return mutation;
};
