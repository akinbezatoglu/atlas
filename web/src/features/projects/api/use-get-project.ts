import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/lib/types";

interface UseGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api<{ data: { project: Project } }>(`/api/projects/${projectId}`);
      return response.data;
    },
  });

  return query;
};
