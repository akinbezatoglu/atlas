'use client'

import { SettingsIcon, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  GoHome,
  GoHomeFill,
  GoCheckCircle,
  GoCheckCircleFill,
} from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
    disable: false,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
    disable: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
    disable: true,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
    disable: true,
  },
];

export const VisitorNavigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/view/workspaces/${workspaceId}${item.href}`
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        if (item.disable) {
          return (
            <>
              <div className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium cursor-not-allowed transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}>
                <Icon className="size-5 text-neutral-500" />
                {item.label}
              </div>
            </>
          )
        }

        return (
          <Link key={item.href} href={fullHref}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}>
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        )
      })}
    </ul>
  );
};