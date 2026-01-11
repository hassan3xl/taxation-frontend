import { AdminNavbar } from "@/components/nav/AdminNavbar";
import { Navbar } from "@/components/nav/Navbar";
import React from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/actions/auth.actions";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const token = await getAccessToken();
  const user = await getCurrentUser();

  console.log("server_user", user, token);

  if (!token) {
    redirect("/login");
  }

  if (user.role !== "agent" && user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="bg-background text-foreground ">
      <div className="">
        <AdminNavbar />

        <main className="px-4 min-h-screen sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <br />
            <br />
            <br />

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
