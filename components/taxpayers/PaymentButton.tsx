"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CalendarIcon, AlertTriangle, Wallet } from "lucide-react";

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
import { FormInput } from "@/components/FormInput"; // Your custom input component

interface PaymentButtonProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const PaymentButton = ({ open, onOpenChange }: PaymentButtonProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({});

  // Watch reason to conditionally show description placeholder or helper text
  const reason = watch("reason");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-5 w-5" /> Pay
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 py-4">
          {/* 1. Reason Selection */}
          <div className="space-y-2"></div>

          <DialogFooter></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
