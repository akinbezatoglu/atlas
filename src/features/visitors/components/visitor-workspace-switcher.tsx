'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceVisitor } from "@/features/workspaces/api/use-get-workspace-visitor";

export const VisitorWorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspace } = useGetWorkspaceVisitor({ workspaceId });

  if (!workspace) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        </div>
        <Select>
          <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent>
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
      </div>
      <Select value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={workspace.$id} value={workspace.$id}>
            <div className="flex justify-start items-center gap-3 font-medium">
              <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
              <span className="truncate">{workspace.name}</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};