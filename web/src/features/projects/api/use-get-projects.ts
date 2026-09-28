import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/lib/types";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: { projects: Project[] } }>("/api/projects", {
        query: { workspaceId },
      });
      return { documents: response.data.projects, total: response.data.projects.length };
    },
  });

  return query;
};
