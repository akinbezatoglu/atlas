import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

interface UseGetWorkspaceVisitorProps {
  workspaceId: string;
}

export const useGetWorkspaceVisitor = ({ workspaceId }: UseGetWorkspaceVisitorProps) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: Workspace }>(`/api/workspaces/${workspaceId}`, {
        query: { visitor: "true" }
      });
      return response.data;
    },
  });

  return query;
};
