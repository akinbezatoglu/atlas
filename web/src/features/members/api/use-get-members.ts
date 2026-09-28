import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Member, PaginatedResponse } from "@/lib/types";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: PaginatedResponse<Member> }>("/api/members", {
        query: { workspaceId },
      });
      return response.data;
    },
  });

  return query;
};
