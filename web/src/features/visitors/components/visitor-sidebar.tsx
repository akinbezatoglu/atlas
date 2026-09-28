import Image from "next/image";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";

import { VisitorNavigation } from "./visitor-navigation";
import { VisitorWorkspaceSwitcher } from "./visitor-workspace-switcher";
import { VisitorProjects } from "./visitor-projects";

export const VisitorSidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <VisitorWorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <VisitorNavigation />
      <DottedSeparator className="my-4" />
      <VisitorProjects />
    </aside>
  );
};