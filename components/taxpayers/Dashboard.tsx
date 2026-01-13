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
import { useGetVehicles } from "@/lib/hooks/taxations.hooks";
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

const Dashboard = () => {
  const { data: vehiclesDetails } = useGetVehicles();
  console.log("vehiclesDetails", vehiclesDetails);
  const router = useRouter();
  const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);
  const [showScanner, setShowScanner] = useState(false);

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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Vehicle Cards */}
        {vehiclesDetails.map((vehicle: VehicleDetails) => (
          <Card key={vehicle.id} className="overflow-hidden shadow-xl border-0">
            {/* Hero Section */}
            <div className="bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10">
                <div className="flex p-2 items-start justify-between mb-6">
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
                          Registered on:
                        </span>
                        <span className="text-sm">
                          {formatDate(vehicle.created_at)}
                        </span>
                      </div>
                    </div>
                    <div>
                      {vehicle.qr_code && (
                        <>
                          {/* Clickable QR */}
                          <button
                            type="button"
                            onClick={() => setShowScanner(true)}
                            className="relative group"
                          >
                            <img
                              src={vehicle.qr_code}
                              alt="Vehicle QR Code"
                              className="w-20 h-20 rounded-lg border shadow-sm"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                              <span className="text-white text-xs font-semibold">
                                Tap to Scan
                              </span>
                            </div>
                          </button>

                          {/* Download */}
                          <a
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
                  <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-green-700 mb-1">
                            Current Balance
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(vehicle.current_balance)}
                          </p>
                        </div>
                        <PaymentButton
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
                      <Card key={payment.id} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-secondary-foreground">
                                  TRX ID: {payment.id.trim().slice(0, 8)}...
                                </p>
                                <p className="text-xs text-secondary-foreground mt-0.5">
                                  Date: {formatDate(payment.timestamp)}
                                </p>
                                <p className="font-semibold text-primary">
                                  Amount:{" "}
                                  {formatCurrency(parseFloat(payment.amount))}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
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
                  <Button className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Button>
                </Link>

                <Link href={`/settings`}>
                  <Button className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
