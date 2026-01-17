"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  CreditCard,
  Settings,
  Shield,
  PieChart,
  LogOut,
  ChevronLeft,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  const menuGroups = [
    {
      label: "Main",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          label: "Vehicles",
          href: "/admin/vehicles",
          icon: Car,
        },
        {
          label: "Exemptions",
          href: "/admin/exemptions",
          icon: FileText,
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          label: "Agents",
          href: "/admin/agents",
          icon: Shield,
        },
      ],
    },
    // {
    //   label: "Finance",
    //   items: [
    //     {
    //       label: "Overview",
    //       href: "/admin/finance",
    //       icon: Banknote,
    //     },
    //     {
    //       label: "Reports",
    //       href: "/admin/finance/reports",
    //       icon: PieChart,
    //     },
    //   ],
    // },
    {
      label: "System",
      items: [
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          label: "Billing",
          href: "/admin/billing",
          icon: CreditCard,
        },
      ],
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed z-[50] left-0 h-full bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none",
          isOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full md:translate-x-0 md:w-[280px]",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border bg-sidebar-accent/10">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2 text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              T
            </div>
            Taxon Admin
          </div>
          <button
            onClick={closeSidebar}
            className="ml-auto md:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 768) closeSidebar();
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-auto">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
