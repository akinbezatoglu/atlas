import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/lib/types";

interface UseGetProjectsVisitorProps {
  workspaceId: string;
}

export const useGetProjectsVisitor = ({ workspaceId }: UseGetProjectsVisitorProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: { projects: Project[] } }>("/api/projects", {
        query: { workspaceId, visitor: "true" },
      });
      return { documents: response.data.projects, total: response.data.projects.length };
    },
  });

  return query;
};
