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
  const [searchQuery, setSearchQuery] = useState("");
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
      // Direct URL just like in Postman: /api/taxations/agent/vehicles/AD-1234/
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
      <Navbar />
      <div className="min-h-screen mt-18 p-2">
        <div className="max-w-xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="flex border py-2 px-4 rounded-lg border-border bg-card justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-secondary-foreground">
                Scan or search vehicles
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={mode === "SCAN" ? "default" : "outline"}
                size="icon"
                onClick={() => setMode("SCAN")}
                className={mode === "SCAN" ? "bg-blue-600" : ""}
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button
                variant={mode === "MANUAL" ? "default" : "outline"}
                size="icon"
                onClick={() => setMode("MANUAL")}
                className={mode === "MANUAL" ? "bg-blue-600" : ""}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* SCANNER AREA */}
          {mode === "SCAN" && (
            <Card className="overflow-hidden border-2 border-border">
              <div className="aspect-square bg-black relative">
                <Scanner
                  onScan={(data: any) => {
                    if (data) {
                      handleSearch(data);
                    }
                  }}
                />
                <div className="absolute inset-0 border-4 border-blue-500/50 z-10 pointer-events-none m-8 rounded-lg animate-pulse" />
              </div>
              <CardFooter className="bg-muted p-3 text-center text-sm text-blue-700 font-medium">
                Point camera at Vehicle QR Code
              </CardFooter>
            </Card>
          )}

          {/* MANUAL SEARCH AREA */}
          {mode === "MANUAL" && (
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Plate Number (e.g. AD-1234)"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchQuery);
                      }
                    }}
                    className="text-lg uppercase font-semibold"
                    disabled={loading}
                  />
                  <Button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={loading || !searchQuery.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* VEHICLE RESULT CARD */}
          {vehicleData && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className=" border-b">
                <div className="flex justify-between items-start">
                  <div className="py-2">
                    <CardTitle className="text-3xl font-bold text-primary">
                      {vehicleData.plate_number}
                    </CardTitle>
                    <p className="text-sm text-secondary-foreground mt-1 font-medium">
                      {vehicleData.owner_name}
                    </p>
                    <p className="text-xs text-secondary-foreground mt-0.5">
                      {vehicleData.phone_number}
                    </p>
                  </div>
                  {vehicleData.is_active ? (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
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
