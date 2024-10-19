import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetWorkspaceProps {
  workspaceId: string;
};

export const useGetWorkspaceVisitor = ({
  workspaceId,
}: UseGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ["workspace-visitor", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["visitor"].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
