import { AdminNavbar } from "@/components/nav/AdminNavbar";
import { Navbar } from "@/components/nav/Navbar";
import React from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/actions/auth.actions";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="bg-background text-foreground ">
        <div className="">
          <AdminNavbar />

          <div className="flex mt-20">
            <div className="">
              <Sidebar />
            </div>
            <div className="p-5  ml-0 md:ml-60 w-full md:max-w-285">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
