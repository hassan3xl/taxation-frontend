"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Printer, Download, Share2, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface ReceiptData {
  id: string;
  amount: number;
  date: string | Date;
  paymentMethod: string;
  payerName?: string;
  plateNumber?: string;
  status: "success" | "pending" | "failed";
  reference?: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ReceiptData | null;
}

export function ReceiptDialog({ open, onOpenChange, data }: ReceiptDialogProps) {
  if (!data) return null;

  const formattedDate = new Date(data.date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Payment Successful</DialogTitle>
          <DialogDescription>
            Your payment has been successfully processed.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 p-4 bg-muted/30 rounded-lg border border-border space-y-4">
          <div className="flex flex-col items-center justify-center py-4 border-b border-dashed border-gray-300 dark:border-gray-700">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Total Amount Paid
            </span>
            <span className="text-3xl font-bold text-primary mt-1">
              {formattedAmount}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono font-medium truncate max-w-[150px]">
                {data.id}
              </span>
            </div>
            
            {data.payerName && (
               <div className="flex justify-between">
               <span className="text-muted-foreground">Payer Name</span>
               <span className="font-medium">{data.payerName}</span>
             </div>
            )}

            {data.plateNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Plate</span>
                <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                  {data.plateNumber}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date</span>
              <span className="font-medium">{formattedDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{data.paymentMethod}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto flex-1 gap-2" variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button className="w-full sm:w-auto flex-1 gap-2" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
