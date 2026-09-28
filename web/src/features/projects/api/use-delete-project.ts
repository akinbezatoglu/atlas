import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type ResponseType = { data: { id: string } };
type RequestType = { param: { projectId: string } };

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api<ResponseType>(`/api/projects/${param.projectId}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Project succesfully deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  return mutation;
};
