import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/lib/types";

type ResponseType = { data: Project };
type RequestType = { form: any };

export const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const name = form instanceof FormData ? form.get("name") : form.name;
      const workspaceId = form instanceof FormData ? form.get("workspaceId") : form.workspaceId;
      
      const response = await api<ResponseType>("/api/projects", {
        method: "POST",
        body: { name, workspaceId },
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Project succesfully created");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  return mutation;
};
