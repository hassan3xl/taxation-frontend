"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  initializePaymentMutation,
  useVerifyPayment,
} from "@/lib/hooks/driver.hooks";

// --- 1. Validation Schema ---
const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"), // Handling as string for input, converting later
  payment_method: z.enum(["online", "agent", "bank", "ussd"]),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentButtonProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  vehicle: any; // Type this strictly if you have the Vehicle interface
}

export const PaymentButton = ({
  vehicle,
  open,
  onOpenChange,
}: PaymentButtonProps) => {
  // --- 2. Hooks & State ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: "online",
      notes: "",
    },
  });

  const paymentMethod = watch("payment_method");

  // React Query Mutations
  const { mutateAsync: initPayment, isPending: isInitializing } =
    initializePaymentMutation();
  const { mutateAsync: verifyPayment, isPending: isVerifying } =
    useVerifyPayment();

  const isLoading = isInitializing || isVerifying;

  // --- 3. Submission Logic ---
  const onSubmit = async (data: PaymentFormValues) => {
    try {
      console.log("Initializing payment for:", vehicle.plate_number);

      // Step 1: Initialize Payment on Backend
      const initResponse = await initPayment({
        vehicle_id: vehicle.id,
        amount: parseFloat(data.amount),
        payment_method: data.payment_method,
        notes: data.notes,
      });

      console.log("Init Response:", initResponse);

      if (data.payment_method === "online") {
        const { reference, payment_url } = initResponse;

        // --- DEV MODE LOGIC ---
        // Since we don't have real keys, the URL is fake.
        // We simulate the user "paying" and then verifying.

        toast.info("DEV MODE: Simulating Paystack Redirection...");

        // Simulate a delay like a real payment gateway
        setTimeout(async () => {
          const confirm = window.confirm(
            `(Dev Mode)\n\nPretend you paid ₦${data.amount} on Paystack?\n\nClick OK to Verify Success.`
          );

          if (confirm) {
            await handleVerification(reference);
          } else {
            toast.warning("Payment cancelled by user (simulated)");
          }
        }, 1000);

        // --- REAL MODE LOGIC (Future) ---
        // window.location.href = payment_url;
      } else if (data.payment_method === "agent") {
        toast.success("Cash payment recorded successfully!");
        handleClose();
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to initialize payment"
      );
    }
  };

  // Step 2: Verify Payment
  const handleVerification = async (reference: string) => {
    try {
      const verifyResponse = await verifyPayment({ reference });
      if (verifyResponse.status === "success") {
        toast.success("Payment Successful!");
        handleClose();
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      toast.error("Error verifying payment.");
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Wallet className="h-4 w-4" /> Make Payment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            Payment for Vehicle:{" "}
            <span className="font-semibold text-primary">
              {vehicle?.plate_number}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₦</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-8"
                {...register("amount")}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              onValueChange={(val: any) => setValue("payment_method", val)}
              defaultValue={paymentMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span>Paystack (Online)</span>
                  </div>
                </SelectItem>
                <SelectItem value="agent">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-green-500" />
                    <span>POS (Online)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-sm text-destructive">
                {errors.payment_method.message}
              </p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g. Daily Levy for Jan 14"
              {...register("notes")}
            />
          </div>

          {/* Summary / Warning */}
          {paymentMethod === "agent" && (
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200">
              You are recording a cash payment. Ensure money is collected.
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {paymentMethod === "online" ? "Proceed to Pay" : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
