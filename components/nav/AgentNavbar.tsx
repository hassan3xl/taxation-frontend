"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BellIcon,
  Menu,
  MenuIcon,
  MessageCircleCode,
  MessageCircleDashedIcon,
  MessageCircleReply,
  Plus,
  X,
} from "lucide-react";
import { AccountDropdown } from "./AccountDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function AgentNavbar() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 border right-0 z-50 ">
      {/* Container to handle padding and max width */}
      <div className="w-full bg-sidebar">
        <div className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="rounded-md ml-2 p-2">
              Taxon
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <Plus onClick={() => router.push("/agent/onboard-drivers")} />
            <AccountDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
