"use client";

import React, { useEffect, useState } from "react";
import { Car, Phone, Check, AlertCircle, Loader2, User } from "lucide-react";
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
import { FormInput } from "@/components/FormInput";

import {
  useGetPlateNumber,
  useRequestOTP,
  useVerifyOTP,
} from "@/lib/hooks/taxations.hooks";
import { Input } from "@/components/ui/input";

type Step = "register" | "verify-details" | "otp";

export default function VehicleRegistrationFlow() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("register");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  console.log("vehicleDetails", vehicleDetails);
  /* -------------------- Forms -------------------- */

  const plateForm = useForm({
    defaultValues: { plateNumber: "" },
  });

  const otpForm = useForm({
    defaultValues: { otp: "" },
  });
  /* -------------------- API Hooks -------------------- */

  const {
    data: vehicleData,
    isFetching: isSearchingVehicle,
    isError: vehicleNotFound,
  } = useGetPlateNumber(plateNumber);

  const { mutateAsync: requestOtp, isPending: requestingOtp } = useRequestOTP();

  const { mutateAsync: verifyOtp, isPending: verifyingOtp } = useVerifyOTP();

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    if (vehicleData) {
      setVehicleDetails(vehicleData);
      setPhoneNumber(vehicleData.masked_phone);
      setStep("verify-details");
    }
  }, [vehicleData]);

  /* -------------------- Handlers -------------------- */

  const handlePlateSubmit = plateForm.handleSubmit((data) => {
    setPlateNumber(data.plateNumber.trim().toUpperCase());
  });

  const handleRequestOtp = async () => {
    if (!vehicleDetails?.vehicle_id) return;
    console.log(vehicleDetails?.vehicle_id);

    await requestOtp({
      vehicle_id: vehicleDetails.vehicle_id,
    });

    setStep("otp");
  };

  if (step === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register Your Vehicle</CardTitle>
            <CardDescription>
              Enter your license plate number to begin
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormInput
              register={plateForm.register}
              name="plateNumber"
              label="License Plate Number"
              placeholder="ABC-1234"
              rules={{ required: "Plate number is required" }}
              className="uppercase"
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
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vehicle not found for this plate number
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handlePlateSubmit}
              className="w-full"
              disabled={isSearchingVehicle}
            >
              {isSearchingVehicle ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                "Look Up Vehicle"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "verify-details") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Vehicle Found</CardTitle>
            <CardDescription>Please confirm the details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plate Number</span>
                <span className="font-semibold">
                  {vehicleDetails.plate_number}
                </span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {vehicleDetails.masked_owner}
                </span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{phoneNumber}</span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4 flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {vehicleDetails.status === true ? "Active" : "Inactive"}
                </span>
              </div>

              {vehicleDetails.make && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Make & Model</span>
                  <span className="font-semibold">
                    {vehicleDetails.make} {vehicleDetails.model}
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={handleRequestOtp}
              className="w-full"
              disabled={requestingOtp}
            >
              {requestingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "otp") {
    const handleOtpSubmit = otpForm.handleSubmit(async (data) => {
      await verifyOtp({
        otp: data.otp,
      });
      router.push("/");
    });

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {phoneNumber}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormInput
              register={otpForm.register}
              name="otp"
              label="OTP Code"
              placeholder="123456"
              rules={{
                required: "OTP is required",
                minLength: { value: 6, message: "OTP must be 6 digits" },
                maxLength: { value: 6, message: "OTP must be 6 digits" },
              }}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />

            {otpForm.formState.errors.otp && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {otpForm.formState.errors.otp.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleOtpSubmit}
              className="w-full"
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
}
