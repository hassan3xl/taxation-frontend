"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Search,
  Camera,
  AlertCircle,
  CheckCircle,
  Banknote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { apiService } from "@/lib/services/apiService";
import { Navbar } from "@/components/nav/Navbar";
import Link from "next/link";
import { AccountDropdown } from "@/components/nav/AccountDropdown";
import { formatPlate } from "@/lib/utils";
import VehicleScanner from "@/components/Vehicles/VehicleScanner";

interface RecentPayment {
  id: string;
  amount: string;
  timestamp: string;
  payment_method?: string;
}

interface VehicleData {
  id: string;
  plate_number: string;
  owner_name: string;
  phone_number: string;
  is_active: boolean;
  current_balance: number;
  total_paid: number;
  total_expected_revenue: number;
  recent_payments: RecentPayment[];
}

export default function HomePage() {
  const [mode, setMode] = useState<"SCAN" | "MANUAL">("MANUAL");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // 1. Search Logic - Direct endpoint like Postman
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a plate number");
      return;
    }

    setLoading(true);
    setVehicleData(null);

    try {
      const res = await apiService.getWithoutToken(
        `/taxations/agent/public/${query.trim().toUpperCase()}/`
      );

      setVehicleData(res);
      toast.success("Vehicle found!");
      setMode("MANUAL"); // Stop scanning if in scan mode
    } catch (error: any) {
      console.error("Search error:", error);

      if (error?.response?.status === 404) {
        toast.error("Vehicle not found with that Plate Number");
      } else {
      }
      setVehicleData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className=" top-0 left-0 border right-0 z-50 ">
        {/* Container to handle padding and max width */}
        <div className="w-full bg-sidebar">
          <div className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center">
              <Link href="/" className="rounded-md ml-2 p-2">
                Taxon
              </Link>
            </div>

            <div className="flex gap-4 items-center">
              <AccountDropdown />
            </div>
          </div>
        </div>
      </nav>
      <div className="min-h-screen mt-18 p-2">
        <div className="max-w-xl mx-auto space-y-6">
          <VehicleScanner
            loading={loading}
            handleSearch={handleSearch}
            mode={mode}
            setMode={setMode}
          />

          {/* VEHICLE RESULT CARD */}
          {vehicleData && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className=" border-b">
                <div className="flex justify-between items-start">
                  <div className="py-2">
                    <CardTitle className="text-3xl font-bold text-primary">
                      {vehicleData.plate_number}
                    </CardTitle>
                  </div>
                  {vehicleData.is_active ? (
                    <div className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className="bg-red-100 text-red-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* STATUS INDICATOR */}
                {vehicleData.current_balance < 0 ? (
                  <Alert
                    variant="destructive"
                    className="border-red-600 bg-red-50"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="text-lg font-bold">OWING</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Driver owes{" "}
                      <strong className="text-xl">
                        ₦
                        {Math.abs(vehicleData.current_balance).toLocaleString()}
                      </strong>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-600 bg-green-50 text-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-lg font-bold">
                      Clean Record
                    </AlertTitle>
                    <AlertDescription>
                      Balance is{" "}
                      <strong className="text-xl">
                        ₦{vehicleData.current_balance.toLocaleString()}
                      </strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* EMPTY STATE */}
          {!vehicleData && !loading && mode === "MANUAL" && (
            <Card className="bg-card border-dashed border-2">
              <CardContent className="pt-12 pb-12 text-center">
                <Search className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-secondary-foreground">
                  Enter a plate number to search
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
