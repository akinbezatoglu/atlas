import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { Project } from "@/lib/types";

type ResponseType = { data: Project };
type RequestType = { form: { name: string } | FormData; param: { projectId: string } };

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const name = form instanceof FormData ? form.get("name") : form.name;
      
      const response = await api<ResponseType>(`/api/projects/${param.projectId}`, {
        method: "PATCH",
        body: { name },
      });

      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Project succesfully updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  return mutation;
};
