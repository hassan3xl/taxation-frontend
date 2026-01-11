"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, ShoppingBag, User2, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

export function AccountDropdown() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleAccount = () => {
    if (user?.role === "taxpayer") {
      router.push("/account/");
    } else {
      router.push("/agent/account");
    }
  };

  return (
    <div>
      <>
        {user ? (
          <div
            onClick={handleAccount}
            className="flex items-center gap-2 border border-border p-2 rounded-full"
          >
            <User2 className="text-green-800" />
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 border border-border p-2 rounded-full"
          >
            <User2 className="text-red-800" />
          </Link>
        )}
      </>
    </div>
  );
}
