"use client";

import React from "react";
import { LayoutDashboard, History, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query"; // Assuming you use TanStack Query
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useGetTaxpayerProfile } from "@/lib/hooks/account.hook";
import LogoutButton from "@/components/auth/LogoutButton";

export default function AccountPage() {
  const { data: taxpayer, isLoading, isError } = useGetTaxpayerProfile();
  const { user } = useAuth();

  console.log("user", taxpayer);
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load bookings.
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-5xl pt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Full Name</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* --- Tabs / Navigation --- */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="bookings" className="gap-2">
              <History className="h-4 w-4" /> My Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <div className="p-8 bg-muted rounded-lg border text-center text-muted-foreground">
              Account settings form goes here...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
