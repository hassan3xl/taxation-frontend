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

interface VehicleScannerProps {
  mode: "SCAN" | "MANUAL";
  setMode: React.Dispatch<React.SetStateAction<"SCAN" | "MANUAL">>;
  handleSearch: (query: string) => Promise<void>;
  loading: boolean;
}

const VehicleScanner = ({
  mode,
  setMode,
  handleSearch,
  loading,
}: VehicleScannerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="space-y-4">
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
              constraints={{
                facingMode: "environment",
              }}
              onScan={(result) => {
                if (!result || result.length === 0) return;

                const qrValue = result[0]?.rawValue;
                if (!qrValue) return;

                // Stop scanning immediately
                setMode("MANUAL");
                setSearchQuery(qrValue.toUpperCase());

                handleSearch(qrValue);
              }}
              onError={(error) => {
                console.error("QR Scan Error:", error);
                toast.error("Unable to access camera");
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
                placeholder="Enter Plate Number (e.g. MTA-1234)"
                value={searchQuery}
                onChange={(e) => {
                  const formatted = formatPlate(e.target.value);
                  setSearchQuery(formatted);
                }}
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
    </div>
  );
};

export default VehicleScanner;
