import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface VisitorTaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

export const VisitorTaskActions = ({ children }: VisitorTaskActionsProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => { }}
            className="font-medium p-[10px] cursor-not-allowed"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { }}
            className="font-medium p-[10px] cursor-not-allowed"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { }}
            className="font-medium p-[10px] cursor-not-allowed"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            onClick={() => { }}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px] cursor-not-allowed"
          >
            <Trash2Icon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}