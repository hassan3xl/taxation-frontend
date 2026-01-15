"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  CreditCard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm "
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed z-[50] left-0 h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border transition-all duration-300 ease-in-out shadow-xl md:shadow-none",
          isOpen
            ? "w-full sm:w-[280px] translate-x-0"
            : "w-60 -translate-x-full md:translate-x-0"
        )}
      >
        <Command className="bg-background rounded-none">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <Link onClick={closeSidebar} href="/admin">
                  Dashboard
                </Link>
              </CommandItem>
              <CommandItem>
                <Newspaper className="mr-2 h-4 w-4" />
                <Link onClick={closeSidebar} href="/admin/vehicles">
                  Vehicles
                </Link>
              </CommandItem>
              <CommandItem>
                <Folders className="mr-2 h-4 w-4" />
                <Link onClick={closeSidebar} href="/admin/users">
                  Users
                </Link>
              </CommandItem>
              <CommandItem>
                <Folders className="mr-2 h-4 w-4" />
                <Link onClick={closeSidebar} href="/admin/exemptions">
                  Exemptions
                </Link>
              </CommandItem>
              <CommandItem>
                <Folders className="mr-2 h-4 w-4" />
                <Link onClick={closeSidebar} href="/admin/finance">
                  Finance
                </Link>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </aside>
    </>
  );
};

export default Sidebar;
