import { AdminNavbar } from "@/components/nav/AdminNavbar";
import { Navbar } from "@/components/nav/Navbar";
import React from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/actions/auth.actions";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
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

          <div className="flex mt-20 ">
            <div className="md:mr-65">
              <Sidebar />
            </div>
            <div className="max-w-7xl p-4 sm:px-6 lg:px-8 mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
