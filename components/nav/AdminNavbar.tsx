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

export const AdminNavbar = () => {
  return (
    <div className="bg-sidebar py-2 px-5 flex justify-between text-white">
      <Link href="/">
        <h2>Taxon</h2>
      </Link>

      <div className="flex items-center">
        {/* <ThemeTogler /> */}

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="text-black">BT</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
