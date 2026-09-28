import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type ResponseType = { data: { id: string } };
type RequestType = { param: { memberId: string }; json: { role: "ADMIN" | "MEMBER" } };

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await api<ResponseType>(`/api/members/${param.memberId}`, {
        method: "PATCH",
        body: json,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Member succesfully updated");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update member");
    },
  });

  return mutation;
};
