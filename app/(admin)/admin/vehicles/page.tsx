"use client";

import React, { useState, useMemo } from "react";
import {
  useAdminApproveVehicle,
  useAdminGetVehicles,
} from "@/lib/hooks/admin.hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  AlertCircle,
  Phone,
  History,
  MoreVertical,
  Ban,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ReportIssueDialog } from "@/components/admin/ReportIssueDialog";
import clsx from "clsx";
import { formatDate } from "@/lib/utils";

const AdminVehicles = () => {
  const { data: vehicles, isLoading } = useAdminGetVehicles();
  const { mutate: approveVehicle, isPending: isApproving } =
    useAdminApproveVehicle();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log(vehicles);

  // State for the Report Issue Modal
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // --- Filtering Logic ---
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    return vehicles.filter((vehicle: any) => {
      // 1. Search Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        vehicle.plate_number.toLowerCase().includes(searchLower) ||
        vehicle.owner_name.toLowerCase().includes(searchLower);

      // 2. Status Filter
      let matchesStatus = true;
      if (statusFilter === "owing") {
        matchesStatus = vehicle.current_balance < 0;
      } else if (statusFilter === "upfront") {
        matchesStatus = vehicle.current_balance >= 0;
      } else if (statusFilter === "inactive") {
        matchesStatus = !vehicle.is_active;
      } else if (statusFilter === "suspended") {
        matchesStatus = vehicle.compliance_status === "INACTIVE_DUE_TO_DEBT";
      }

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  // --- Helpers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return "text-red-600";
    if (balance === 0) return "text-gray-600";
    return "text-green-600";
  };

  // Uses the backend 'compliance_status' for accurate badging
  const getStatusBadge = (vehicle: any) => {
    // 1. Hard Inactive (Admin disabled)
    if (!vehicle.is_active) {
      return (
        <Badge variant="destructive" className="flex gap-1 items-center">
          <Ban className="w-3 h-3" /> Inactive
        </Badge>
      );
    }

    // 2. Currently Sick / Exempt (Top Priority Status)
    if (vehicle.active_exemption) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 hover:bg-blue-100 flex gap-1 items-center"
        >
          <Stethoscope className="w-3 h-3" /> Exempt
        </Badge>
      );
    }

    // 3. Compliance Logic
    switch (vehicle.compliance_status) {
      case "INACTIVE_DUE_TO_DEBT":
        return (
          <Badge
            variant="destructive"
            className="flex gap-1 items-center bg-red-700"
          >
            <ShieldAlert className="w-3 h-3" /> Suspended
          </Badge>
        );
      case "OWING":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 bg-orange-50"
          >
            Owing
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            Active
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) return <div className="p-8">Loading fleet data...</div>;

  return (
    <div className="space-y-6 items-center justify-center">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Fleet Management
          </h2>
          <p className="text-muted-foreground">
            Monitor vehicle taxes, debts, and exemptions.
          </p>
        </div>
      </div>

      <div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plate or owner..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="owing">Owing Tax</SelectItem>
              <SelectItem value="suspended">
                Suspended (7+ Days Debt)
              </SelectItem>
              <SelectItem value="upfront">Paid/Upfront</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle: any) => (
          <Card
            key={vehicle.id}
            className={clsx("transition-all hover:shadow-md", {
              "bg-muted border-yellow-400":
                vehicle.compliance_status === "INACTIVE_MANUAL",

              "bg-red-50 border-red-500":
                vehicle.compliance_status === "INACTIVE_DUE_TO_DEBT",
            })}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold font-mono">
                  {vehicle.plate_number}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  {vehicle.owner_name}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  {vehicle.is_approved_by_admin ? (
                    <Badge className="flex gap-1 items-center bg-green-100">
                      <ShieldAlert className="w-3 h-3" /> Approved
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex gap-1 items-center"
                      onClick={() => approveVehicle(vehicle.id)}
                      disabled={isApproving}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                  )}
                  {getStatusBadge(vehicle)}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsReportDialogOpen(true);
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Report Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </div>
                <div
                  className={`text-2xl font-bold ${getBalanceColor(
                    vehicle.current_balance
                  )}`}
                >
                  {formatCurrency(vehicle.current_balance)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1 p-2 bg-slate-100 rounded-md dark:bg-slate-800">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold">
                    {formatCurrency(vehicle.total_paid)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-2 bg-slate-100 rounded-md dark:bg-slate-800">
                  <span className="text-muted-foreground">Expected Rev</span>
                  <span className="font-semibold">
                    {formatCurrency(vehicle.total_expected_revenue)}
                  </span>
                </div>
              </div>

              {/* Status Alerts */}

              {/* 1. Debt Suspension Warning */}
              {vehicle.compliance_status === "INACTIVE_DUE_TO_DEBT" && (
                <div className="mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                  <Ban className="h-4 w-4" />
                  <span>Suspended: Debt limit exceeded.</span>
                </div>
              )}

              {/* 2. Active Exemption Notice */}
              {vehicle.active_exemption && (
                <div className="mt-4 flex flex-col gap-1 rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <Stethoscope className="h-4 w-4" />
                    {vehicle.active_exemption.reason}
                  </div>
                  <span className="text-xs opacity-80">
                    Tax paused until {vehicle.active_exemption.end_date}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-2 border-t bg-muted/20 p-4">
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {vehicle.phone_number}
                </div>
                <span>
                  Joined on {formatDate(vehicle.created_at)} | Approved on{" "}
                  {formatDate(vehicle?.activated_at)}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p>No vehicles found matching your filters.</p>
          </div>
        )}
      </div>

      {/* --- Dialog Implementation --- */}
      {/* We control the dialog state here to prevent rendering multiple hidden dialogs */}
      {selectedVehicle && (
        <ReportIssueDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          vehicleId={selectedVehicle.id}
          plateNumber={selectedVehicle.plate_number}
        />
      )}
    </div>
  );
};

export default AdminVehicles;
