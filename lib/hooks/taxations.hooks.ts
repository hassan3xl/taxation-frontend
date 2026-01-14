import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { taxationApi } from "../api/taxation.api";

export function useGetPlateNumber(plateNumber: string) {
  return useQuery({
    queryKey: [],
    queryFn: () => taxationApi.getPlateNumber(plateNumber),
    enabled: Boolean(plateNumber), // 🔑 THIS FIXES EVERYTHING
    retry: false, // Prevents automatic retries on error
  });
}

export function useRequestOTP() {
  return useMutation({
    mutationKey: [],
    mutationFn: (data: any) => taxationApi.requestOtp(data),
    onSuccess: () => {
      toast.success("OTP sent successfully!");
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationKey: [],
    mutationFn: (otp: any) => taxationApi.verifyOTP(otp),
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
  });
}

export function useGetVehicles() {
  return useQuery({
    queryKey: ["taxpayer-vehicles"],
    queryFn: () => taxationApi.getVehicles(),
  });
}
