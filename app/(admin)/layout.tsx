import { AdminNavbar } from "@/components/nav/AdminNavbar";
import { Navbar } from "@/components/nav/Navbar";
import React from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/actions/auth.actions";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

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
    <div className="bg-background text-foreground ">
      <div className="">
        <AdminNavbar />

        <div className="flex">
          <div className="hidden md:block h-screen w-75">
            <Sidebar />
          </div>
          <div className="p-5 w-full md:max-w-285">{children}</div>
        </div>
      </div>
    </div>
  );
}
