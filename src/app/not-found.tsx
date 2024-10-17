'use client'

import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFounPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <FileQuestion className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Page not found
      </p>
      <Button variant="secondary">
        <Link href="/">
          Back to home
        </Link>
      </Button>
    </div>
  );
};

export default NotFounPage;
