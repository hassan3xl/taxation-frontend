import { Navbar } from "@/components/nav/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser();

  console.log("server_user", user);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "taxpayer") {
    redirect("/agent");
  }

  return (
    <div className="bg-background text-foreground ">
      <div className="">
        <Navbar />

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
