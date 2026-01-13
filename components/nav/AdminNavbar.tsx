"use client";

import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher";

export const AdminNavbar = () => {
  const { toggleSidebar, isOpen, closeSidebar } = useSidebar();
  return (
    <div className="fixed top-0 left-0 border right-0 z-50 w-full bg-sidebar py-5 px-5 flex justify-between">
      <div className="flex ">
        <div className="md:hidden">
          {isOpen && (
            <X
              className="mr-4 cursor-pointer"
              size={24}
              onClick={closeSidebar}
            />
          )}
          {!isOpen && (
            <Menu
              className="mr-4 cursor-pointer"
              size={24}
              onClick={toggleSidebar}
            />
          )}
        </div>
        <Link href="/admin">
          <h2 className="font-semibold text-xl">Taxon</h2>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <ThemeSwitcher />

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="text-black">BT</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
