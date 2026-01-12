import { Navbar } from "@/components/nav/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/public");
  }

  if (user?.role !== "taxpayer") {
    redirect("/agent");
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 px-4  sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-auto pb-6">{children}</div>
      </main>
    </div>
  );
}
