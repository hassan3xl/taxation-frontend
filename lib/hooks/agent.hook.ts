import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { agentApi } from "../api/agent.api";

export const useAddVehicle = () => {
  return useMutation({
    mutationFn: (data: any) => agentApi.addVehicle(data),
    onSuccess: () => {
      toast.success("vehicle added successfully!");
    },
  });
};

// export const DeactivateTaxpayer = () => {
//   return useMutation({
//     mutationFn: (: any) => agentApi.deactivateTaxpayer(),
//     onSuccess: () => {
//       toast.success("Taxpayer deactivated successfully!");
//     },
//   });
// };
