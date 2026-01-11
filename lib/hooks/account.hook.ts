import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { accountApi } from "../api/accont.api";

export function useGetUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => accountApi.getUserProfile(),
  });
}
export function useGetTaxpayerProfile() {
  return useQuery({
    queryKey: ["taxpayerProfile"],
    queryFn: () => accountApi.getTaxpayerProfile(),
  });
}

export function useGetAgentProfile() {
  return useQuery({
    queryKey: ["agentProfile"],
    queryFn: () => accountApi.getAgentProfile(),
  });
}
