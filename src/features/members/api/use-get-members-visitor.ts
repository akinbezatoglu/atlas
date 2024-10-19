import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetMembersProps {
  workspaceId: string;
};

export const useGetMembersVisitor = ({
  workspaceId,
}: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members-visitor", workspaceId],
    queryFn: async () => {
      const response = await client.api.members["visitor"].$get({ query: { workspaceId } });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
