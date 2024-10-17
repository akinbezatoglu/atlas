'use client'

import { UseGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const WorkspaceIdJoinClient = () => {
  const workspaceId = useWorkspaceId();
  const { data:initialValues, isLoading } = UseGetWorkspaceInfo({workspaceId});

  if (isLoading) {
    return <PageLoader />
  }

  if (!initialValues) {
    return <PageError message="Project not found" />
  }
  
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValues={initialValues}
      />
    </div>
  )
}