"use client";
import React, { useState } from "react";
import {
  Car,
  Calendar,
  Check,
  History,
  Settings,
  Plus,
  Wallet,
  TrendingUp,
  CreditCard,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetVehicles } from "@/lib/hooks/driver.hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentButton } from "./PaymentButton";

// Type definitions
interface RecentPayment {
  id: string;
  amount: string;
  payment_method: string;
  timestamp: string;
  notes: string;
}

interface VehicleDetails {
  id: string;
  plate_number: string;
  owner_name: string;
  phone_number: string;
  created_at: string;
  is_active: boolean;
  qr_code: string | null;
  current_balance: number;
  total_paid: number;
  total_expected_revenue: number;
  recent_payments: RecentPayment[];
}
import { ReceiptDialog, ReceiptData } from "@/components/shared/ReceiptDialog";

// ... (previous types)

const Dashboard = () => {
  const { data: vehiclesDetails } = useGetVehicles();
  // console.log("vehiclesDetails", vehiclesDetails);
  const router = useRouter();
  const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(
    null,
  );

  const handleViewReceipt = (
    payment: RecentPayment,
    vehicle: VehicleDetails,
  ) => {
    setSelectedReceipt({
      id: payment.id,
      amount: parseFloat(payment.amount),
      date: payment.timestamp,
      paymentMethod: payment.payment_method,
      payerName: vehicle.owner_name,
      plateNumber: vehicle.plate_number,
      status: "success",
    });
    setShowReceipt(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  if (!vehiclesDetails || vehiclesDetails.length === 0) {
    // ... (empty state)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No vehicle found</p>
            <br />
            <Link href={`/new`} className="">
              <Button>Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Vehicle Cards */}
        {vehiclesDetails.map((vehicle: VehicleDetails) => (
          <Card key={vehicle.id} className="overflow-hidden shadow-xl border-0">
            {/* Hero Section */}
            <div className="bg-card relative overflow-hidden">
              {/* ... (background styling) */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative p-4 z-10">
                {/* ... (header content) */}
                <div className="flex p-4 items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Car className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-wider mt-1">
                        {vehicle.plate_number}
                      </h2>
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Registered on
                        </span>
                        <span className="text-sm">
                          {formatDate(vehicle.created_at)}
                        </span>
                      </div>
                      {vehicle.qr_code && (
                        <>
                          {/* Download */}
                          <a
                            target="_blank"
                            href={vehicle.qr_code}
                            download={`${vehicle.plate_number}-qr.png`}
                            className="text-xs text-primary underline"
                          >
                            Download QR
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={`${
                      vehicle.is_active
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white border-0 px-3 py-1`}
                  >
                    {vehicle.is_active ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Active
                      </>
                    ) : (
                      "Inactive"
                    )}
                  </Badge>
                </div>

                <div className="grid p-2 grid-cols-2 gap-4">
                  {/* ... (details grid) */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <User className="h-4 w-4 mb-1 opacity-75" />
                    <p className="text-xs opacity-75">Owner</p>
                    <p className="font-semibold text-sm mt-0.5">
                      {vehicle.owner_name}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Phone className="h-4 w-4 mb-1 opacity-75" />
                    <p className="text-xs opacity-75">Contact</p>
                    <p className="font-semibold text-sm mt-0.5">
                      {vehicle.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Financial Overview */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  Financial Overview
                </h3>
                <div className="grid sm:grid-cols-1 gap-4">
                  <Card
                    className={` ${
                      vehicle.current_balance < 0
                        ? "bg-red-400"
                        : "bg-green-400"
                    } text-white border-0`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium mb-1">
                            Current Balance
                          </p>
                          <p className="text-2xl font-bold ">
                            {formatCurrency(vehicle.current_balance)}
                          </p>
                        </div>
                        <PaymentButton
                          vehicle={vehicle}
                          open={openPaymentDialog}
                          onOpenChange={setOpenPaymentDialog}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Payments */}
              {vehicle.recent_payments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-600" />
                    Recent Payments
                  </h3>
                  <div className="space-y-3">
                    {vehicle.recent_payments.map((payment) => (
                      <Card
                        key={payment.id}
                        className="bg-card border-border cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleViewReceipt(payment, vehicle)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-secondary-foreground font-medium">
                                  {formatCurrency(parseFloat(payment.amount))}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {formatDate(payment.timestamp)}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                  ID: {payment.id.trim().slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="capitalize text-xs"
                            >
                              {payment.payment_method}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href={`/history`}>
                  <Button className="w-full" variant="outline">
                    <History className="mr-2 h-4 w-4" />
                    Full History
                  </Button>
                </Link>

                <Link href={`/settings`}>
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        data={selectedReceipt}
      />
    </div>
  );
};

export default Dashboard;
