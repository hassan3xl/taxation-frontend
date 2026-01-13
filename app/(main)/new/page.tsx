"use client";

import React, { useEffect, useState } from "react";
import {
  Car,
  Phone,
  Check,
  AlertCircle,
  Loader2,
  User,
  ArrowRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "@/components/FormInput"; // Assuming this handles register/props correctly
import { Input } from "@/components/ui/input";

import {
  useGetPlateNumber,
  useRequestOTP,
  useVerifyOTP,
} from "@/lib/hooks/taxations.hooks";

type Step = "register" | "verify-details" | "otp";

export default function VehicleRegistrationFlow() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("register");
  // This state triggers the API. We keep it separate from the form input.
  const [queryPlateNumber, setQueryPlateNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState<any>(null);
  const [maskedPhone, setMaskedPhone] = useState("");

  /* -------------------- Forms -------------------- */

  const plateForm = useForm({
    defaultValues: { plateNumber: "" },
    mode: "onChange",
  });

  const otpForm = useForm({
    defaultValues: { otp: "" },
  });

  // Watch for changes in the input to reset the API error state
  const plateInputValue = plateForm.watch("plateNumber");

  /* -------------------- API Hooks -------------------- */

  // Only run query if queryPlateNumber is set
  const {
    data: vehicleData,
    isFetching: isSearchingVehicle,
    isError: vehicleNotFound,
  } = useGetPlateNumber(queryPlateNumber);

  const { mutateAsync: requestOtp, isPending: requestingOtp } = useRequestOTP();
  const { mutateAsync: verifyOtp, isPending: verifyingOtp } = useVerifyOTP();

  /* -------------------- Effects -------------------- */

  // 1. Reset the API trigger when user starts typing again
  // This fixes the "locked" feeling. As soon as they type, error clears.
  useEffect(() => {
    if (queryPlateNumber && plateInputValue !== queryPlateNumber) {
      setQueryPlateNumber("");
    }
  }, [plateInputValue, queryPlateNumber]);

  // 2. Handle successful vehicle fetch
  useEffect(() => {
    if (vehicleData) {
      setVehicleDetails(vehicleData);
      setMaskedPhone(vehicleData.masked_phone);
      setStep("verify-details");
    }
  }, [vehicleData]);

  /* -------------------- Handlers -------------------- */

  const onPlateSubmit = (data: { plateNumber: string }) => {
    // Trigger the API hook by setting state
    setQueryPlateNumber(data.plateNumber.trim().toUpperCase());
  };

  const onRequestOtp = async () => {
    if (!vehicleDetails?.vehicle_id) return;

    try {
      await requestOtp({
        vehicle_id: vehicleDetails.vehicle_id,
      });
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const onOtpSubmit = async (data: { otp: string }) => {
    try {
      await verifyOtp({ otp: data.otp });
      router.push("/");
    } catch (error) {
      console.error("OTP Verification failed", error);
    }
  };

  /* -------------------- Render Steps -------------------- */

  if (step === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register Your Vehicle</CardTitle>
            <CardDescription>
              Enter your license plate number to begin
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* WRAPPER FORM: Enables Enter key submission */}
            <form
              onSubmit={plateForm.handleSubmit(onPlateSubmit)}
              className="space-y-6"
            >
              <FormInput
                register={plateForm.register}
                name="plateNumber"
                label="License Plate Number"
                placeholder="ABC-1234"
                rules={{ required: "Plate number is required" }}
                className="uppercase tracking-wider font-mono"
                autoFocus
              />

              {plateForm.formState.errors.plateNumber && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {plateForm.formState.errors.plateNumber.message}
                  </AlertDescription>
                </Alert>
              )}

              {vehicleNotFound && (
                <Alert
                  variant="destructive"
                  className="animate-in fade-in slide-in-from-top-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vehicle not found. Please check the number and try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSearchingVehicle}
              >
                {isSearchingVehicle ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    Look Up Vehicle <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "verify-details") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Vehicle Found</CardTitle>
            <CardDescription>
              Please confirm these details match
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">
                  Plate Number
                </span>
                <span className="font-mono font-bold text-lg">
                  {vehicleDetails.plate_number}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {vehicleDetails.masked_owner}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{maskedPhone}</span>
              </div>

              {vehicleDetails.make && (
                <div className="flex items-center gap-3">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {vehicleDetails.make} {vehicleDetails.model}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep("register");
                  setQueryPlateNumber("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={onRequestOtp}
                className="flex-[2]"
                disabled={requestingOtp}
              >
                {requestingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Confirm & Send OTP"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to{" "}
              <span className="font-bold">{maskedPhone}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="space-y-6"
            >
              <FormInput
                register={otpForm.register}
                name="otp"
                label="One-Time Password"
                placeholder="000000"
                rules={{
                  required: "OTP is required",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                  maxLength: { value: 6, message: "OTP must be 6 digits" },
                }}
                className="text-center text-3xl tracking-[0.5em] font-mono h-14"
                maxLength={6}
                autoFocus
              />

              {otpForm.formState.errors.otp && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {otpForm.formState.errors.otp.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={verifyingOtp}>
                {verifyingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
}
