"use client";

import React from "react";
import { LayoutDashboard, History, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query"; // Assuming you use TanStack Query
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { BookingCard } from "@/components/bookings/BookingsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useGetAgentProfile } from "@/lib/hooks/account.hook";
import LogoutButton from "@/components/auth/LogoutButton";

export default function AgentAccountPage() {
  const { data: agent, isLoading, isError } = useGetAgentProfile();
  // const { user } = useAuth();

  console.log("user", agent);
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
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Full Name</p>
              <p className="text-muted-foreground text-sm">{agent?.email}</p>
            </div>
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

          {/* <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Booking History</h2>
              <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border">
                {bookings?.length} Total Trips
              </span>
            </div>

            {bookings && bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {bookings.map((booking: any) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted rounded-xl border border-dashed">
                <p className="text-muted-foreground">No bookings found.</p>
                <Button variant="link" className="mt-2">
                  Book your first trip
                </Button>
              </div>
            )}
          </TabsContent> */}

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
