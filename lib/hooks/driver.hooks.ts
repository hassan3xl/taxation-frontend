import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { driverApi } from "../api/driver.api";

export function useGetPlateNumber(plateNumber: string) {
  return useQuery({
    queryKey: [],
    queryFn: () => driverApi.getPlateNumber(plateNumber),
    enabled: Boolean(plateNumber), // 🔑 THIS FIXES EVERYTHING
    retry: false, // Prevents automatic retries on error
  });
}

export function useRequestOTP() {
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
    mutationFn: (otp: any) => driverApi.verifyOTP(otp),
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

export const initializePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["initialize-payment"],
    mutationFn: (data: any) => driverApi.initializePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxpayer-vehicles"] });
      toast.success("Payment initialized successfully!");
    },
  });
};

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["verify-payment"],
    mutationFn: (data: { reference: string }) => driverApi.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxpayer-vehicles"] });
      toast.success("Payment verified successfully!");
    },
  });
}
