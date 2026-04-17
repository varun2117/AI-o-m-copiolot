"use client";

import { Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/login">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
