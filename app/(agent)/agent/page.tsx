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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ReportIssueDialog } from "@/components/admin/ReportIssueDialog";
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
  compliance_status: string;
  recent_payments: RecentPayment[];
  created_at: Date;
  updated_at: Date;
}

// ... (imports)
import { ReceiptDialog, ReceiptData } from "@/components/shared/ReceiptDialog";

// ... (interfaces)

export default function AgentScanner() {
  const [mode, setMode] = useState<"SCAN" | "MANUAL">("MANUAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  const handleViewReceipt = (payment: RecentPayment) => {
    if (!vehicleData) return;
    setSelectedReceipt({
      id: payment.id,
      amount: parseFloat(payment.amount),
      date: payment.timestamp,
      paymentMethod: payment.payment_method || "Cash",
      payerName: vehicleData.owner_name,
      plateNumber: vehicleData.plate_number,
      status: "success",
    });
    setShowReceipt(true);
  };

  // ... (handleSearch, handlePayment implementation)
  console.log("vehicleData", vehicleData);
  // 1. Search Logic - Direct endpoint like Postman
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a plate number");
      return;
    }

    setLoading(true);
    setVehicleData(null);

    try {
      const res = await apiService.get(
        `/agent/vehicles/${query.trim().toUpperCase()}/`
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

  // 2. Payment Logic (POST)
  const handlePayment = async () => {
    if (!vehicleData || !paymentAmount) {
      toast.error("Please enter a payment amount");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const res = await apiService.post(
        `/agent/vehicles/${vehicleData.plate_number}/pay/`,
        { amount }
      );

      // Update the vehicle data with the new balance
      setVehicleData(res);
      setPaymentAmount("");
      toast.success("Payment collected successfully!");
    } catch (error: any) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-2 pb-20">
      <div className="">
        <VehicleScanner
          loading={loading}
          handleSearch={handleSearch}
          mode={mode}
          setMode={setMode}
        />

        {/* VEHICLE RESULT CARD */}
        {vehicleData && (
          <Card className="animate-in mt-2 fade-in slide-in-from-bottom-4">
            {/* ... (Header and Status Indicator) */}
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
              {vehicleData.compliance_status === "INACTIVE_DUE_TO_DEBT" && (
                <div className="bg-red-500 text-white p-4 rounded">
                  ⛔ THIS VEHICLE IS SUSPENDED.
                  <p>You have missed payments for over 7 days.</p>
                </div>
              )}
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
                      ₦{Math.abs(vehicleData.current_balance).toLocaleString()}
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

              <ReportIssueDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                vehicleId={vehicleData.id}
                plateNumber={vehicleData.plate_number}
              />
              {/* PAYMENT FORM */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide">
                  Collect Cash Payment
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="Enter amount (e.g. 150)"
                    className="pl-10 text-lg h-12 font-semibold"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePayment();
                      }
                    }}
                    disabled={loading}
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold shadow-lg"
                  onClick={handlePayment}
                  disabled={loading || !paymentAmount}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </div>

              {/* RECENT HISTORY */}
              {vehicleData.recent_payments &&
                vehicleData.recent_payments.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-secondary-foreground font-bold mb-3 uppercase tracking-wide">
                      Recent Payments
                    </p>
                    <div className="space-y-2">
                      {vehicleData.recent_payments.slice(0, 5).map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-center text-sm p-3 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleViewReceipt(p)}
                          role="button"
                          tabIndex={0}
                        >
                          <div>
                            <span className="text-secondary-foreground text-xs block">
                              {new Date(p.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                             <span className="text-[10px] text-muted-foreground font-mono">
                                {p.id.substring(0, 8)}...
                            </span>
                            {p.payment_method && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded inline-block">
                                {p.payment_method}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-green-700">
                            ₦{parseFloat(p.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
        <br />
        {/* EMPTY STATE */}
        {!vehicleData && !loading && mode === "MANUAL" && (
          <Card className="bg-card border-dashed border-2">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="h-12 w-12 text-primary mx-auto mb-3" />
              <p className="text-secondary-foreground">
                Enter a plate number or scan to search vehicle
              </p>
            </CardContent>
          </Card>
        )}
      </div>

       <ReceiptDialog 
        open={showReceipt} 
        onOpenChange={setShowReceipt} 
        data={selectedReceipt} 
      />
    </div>
  );
}
