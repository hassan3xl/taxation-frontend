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
import AgentAddVehicle from "../agents/AgentAddVehicle";

export function AgentNavbar() {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-sidebar py-5 px-5 flex justify-between">
      {/* Container to handle padding and max width */}
      <div>
        <div className="flex items-center">
          <Link href="/" className="rounded-md ml-2 p-2">
            Taxon
          </Link>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <AgentAddVehicle />
        <AccountDropdown />
      </div>
    </div>
  );
}
