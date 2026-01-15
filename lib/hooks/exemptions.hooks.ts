import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { driverApi } from "../api/driver.api";

export function useApplyExemption() {
  return useMutation({
    mutationKey: [],
    mutationFn: (data: any) => driverApi.requestOtp(data),
    onSuccess: () => {
      toast.success("OTP sent successfully!");
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationKey: [],
    mutationFn: (otp: string) => driverApi.verifyOTP(otp),
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
  });
}

export function useGetVehicles() {
  return useQuery({
    queryKey: ["taxpayer-vehicles"],
    queryFn: () => driverApi.getVehicles(),
  });
}
