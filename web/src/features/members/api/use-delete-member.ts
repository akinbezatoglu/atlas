import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type ResponseType = { data: { id: string } };
type RequestType = { param: { memberId: string } };

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api<ResponseType>(`/api/members/${param.memberId}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Member succesfully deleted");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete member");
    },
  });

  return mutation;
};
