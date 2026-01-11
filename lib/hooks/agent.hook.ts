import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { agentApi } from "../api/agent.api";

export const useActivateTaxpayer = () => {
  return useMutation({
    mutationFn: () => agentApi.activateTaxpayer(),
    onSuccess: () => {
      toast.success("Taxpayer activated successfully!");
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
