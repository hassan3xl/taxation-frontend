import React from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/actions/auth.actions";
import { getCurrentUser } from "@/lib/auth";
import { AgentNavbar } from "@/components/nav/AgentNavbar";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default async function AgentLayout({ children }: AgentLayoutProps) {
  const token = await getAccessToken();
  const user = await getCurrentUser();

  if (!token || !user) {
    redirect("/auth/signin");
  }

  if (user.role !== "agent") {
    redirect("/admin");
  }

  return (
    <div className="bg-background text-foreground ">
      <div className="">
        <AgentNavbar />

        <div className="flex mt-20 ">
          <div className="max-w-7xl p-4 sm:px-6 lg:px-8 mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
